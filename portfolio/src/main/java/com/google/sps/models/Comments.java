package com.google.sps.models;

import java.util.List;

/**
 * Comments class is a group between Comment and Info,
 * so this can be sent to client in a standardized way
 */
public class Comments {
  private Info info;
  private List<Comment> results;

  /**
   * Comments Constructor
   * Is used to construct the API response previous to convert it to JSON
   * and send it client
   * 
   * @param _info Info object with pagination data
   * @param _results List of Comments to be sent
   */
  public Comments(Info _info, List<Comment> _results) {
    info = _info;
    results = _results;
  }

  /**
   * @return the info related to comments query
   */
  public Info getInfo() {
    return info;
  }

  /**
    * @return the results of comments query as a list of Comments
    */
  public List<Comment> getResults() {
    return results;
  }
}
