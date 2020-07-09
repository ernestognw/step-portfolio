package com.google.sps.models;

import java.util.List;

public class Comments {
  private Info info;
  private List<Comment> results;

  public Comments(Info _info, List<Comment> _results) {
    info = _info;
    results = _results;
  }

  public Info getInfo() {
    return info;
  }

  public List<Comment> getCommentList() {
    return results;
  }
}
