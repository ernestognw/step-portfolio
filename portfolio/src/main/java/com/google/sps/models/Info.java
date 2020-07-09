package com.google.sps.models;

/**
 * The Info class is used as a helper to API responses.
 * It has data about the data returned by any endpoint
 * and its intended to mainly support pagination
 */
public class Info {
  /**
   * @note
   * Both of next and prev are set to Integer,
   * so they can be nullified in some scenarios
   */
  private Integer next;
  private Integer prev;
  private int count;
  private int pages;

  /**
   * Comment Constructor
   * Is used to create a comment, in order to
   * send it to client in JSON format
   * 
   * @param _next Number of next page. Can be null
   * @param _prev Number of previous page. Can be null
   * @param _count Total number of entities for the requested resource
   * @param _pages Total number of pages available for 
   * the requested resource given the search params
   */
  public Info(Integer _next, Integer _prev, int _count, int _pages) {
    next = _next;
    prev = _prev;
    count = _count;
    pages = _pages;
  }

  /**
   * @return the number of the next page.
   * Can be null if current page is the last page
   */
  public Integer getNext() {
    return next;
  }

  /**
   * @return the number of the previous page
   * Can be null if current page is the first page
   */
  public Integer getPrev() {
    return prev;
  }

  /**
   * @return the total count of entities of a particular query
   */
  public int getCount() {
    return count;
  }

  /**
   * @return the total pages available depending on params sent to a query
   */
  public int getPages() {
    return pages;
  }
}
