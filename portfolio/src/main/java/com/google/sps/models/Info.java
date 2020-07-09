package com.google.sps.models;

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

  public Info(Integer _next, Integer _prev, int _count, int _pages) {
    next = _next;
    prev = _prev;
    count = _count;
    pages = _pages;
  }

  public int getNext() {
    return next;
  }

  public int getPrev() {
    return prev;
  }

  public int getCount() {
    return count;
  }

  public int getPages() {
    return pages;
  }
}
