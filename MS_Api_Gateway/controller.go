package main

import (
    "encoding/json"
    "io"
    "net/http"
    "strings"
)

func handleAnalyze(w http.ResponseWriter, r *http.Request) {
    targetURL := "http://localhost:5001" + r.URL.Path
    urlParam, err := readBodyParam(r, "url")
    if err != nil {
        http.Error(w, "'url' parameter is required in the POST body", http.StatusBadRequest)
        return
    }
    jsonBody, err := json.Marshal(map[string]string{"url": urlParam})
    if err != nil {
        http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
        return
    }
    resp, err := http.Post(targetURL, "application/json", strings.NewReader(string(jsonBody)))
    if err != nil {
        http.Error(w, "Service unavailable", http.StatusServiceUnavailable)
        return
    }
    defer resp.Body.Close()
    w.WriteHeader(resp.StatusCode)
    io.Copy(w, resp.Body)
}

func handleAsk(w http.ResponseWriter, r *http.Request) {
    targetURL := "http://localhost:5002" + r.URL.Path
    userInput, err := readBodyParam(r, "user-input")
    if err != nil {
        http.Error(w, "'user-input' parameter is required in the POST body", http.StatusBadRequest)
        return
    }
    jsonBody, err := json.Marshal(map[string]string{"question": userInput})
    if err != nil {
        http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
        return
    }
    resp, err := http.Post(targetURL, "application/json", strings.NewReader(string(jsonBody)))
    if err != nil {
        http.Error(w, "Service unavailable", http.StatusServiceUnavailable)
        return
    }
    defer resp.Body.Close()
    w.WriteHeader(resp.StatusCode)
    io.Copy(w, resp.Body)
}
