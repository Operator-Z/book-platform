package com.bookplatform.library.dto;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenLibraryResponse {
    private List<OpenLibraryDoc> docs;
    public List<OpenLibraryDoc> getDocs() { return docs; }
    public void setDocs(List<OpenLibraryDoc> docs) { this.docs = docs; }
}
