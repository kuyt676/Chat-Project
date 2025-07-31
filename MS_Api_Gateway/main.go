package main

import (
    "encoding/json"
    "io"
    "log"
    "net/http"
    "strings"
    "sync"
)

func main() {
    // Concurrently process 20 article URLs at startup
    processArticleURLs()

    http.HandleFunc("/", handleRequest)

    log.Println("API Gateway is running on port 8080...")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal("Error starting server:", err)
    }
}

// Concurrently fetch and process a list of 20 article URLs
func processArticleURLs() {
    // Use ArticleURLs from article_urls.go
    var wg sync.WaitGroup
    for _, url := range ArticleURLs {
        wg.Add(1)
        go func(articleURL string) {
            defer wg.Done()
            // Use the same JSON encoding logic as in handleRequest
            payload, _ := json.Marshal(map[string]string{"url": articleURL})
            req, err := http.NewRequest("POST", "http://localhost:5001/analyze", strings.NewReader(string(payload)))
            if err != nil {
                log.Printf("Failed to create request for %s: %v", articleURL, err)
                return
            }
            req.Header.Set("Content-Type", "application/json")
            resp, err := http.DefaultClient.Do(req)
            if err != nil {
                log.Printf("Failed to process %s: %v", articleURL, err)
                return
            }
            defer resp.Body.Close()
            if resp.StatusCode == http.StatusOK {
                log.Printf("Successfully processed %s", articleURL)
            } else {
                body, _ := io.ReadAll(resp.Body)
                log.Printf("Failed to process %s: status %d, body: %s", articleURL, resp.StatusCode, string(body))
            }
        }(url)
    }
    wg.Wait()
}

func readBodyParam(r *http.Request, paramName string) (string, error) {
    bodyBytes, err := io.ReadAll(r.Body)
    if err != nil || len(bodyBytes) == 0 {
        return "", http.ErrBodyNotAllowed
    }
    return string(bodyBytes), nil
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
    path := r.URL.Path

    if strings.HasPrefix(path, "/analyze/") {
        handleAnalyze(w, r)
        return
    } else if strings.HasPrefix(path, "/ask/") {
        handleAsk(w, r)
        return
    } else {
        http.NotFound(w, r)
        return
    }
}

