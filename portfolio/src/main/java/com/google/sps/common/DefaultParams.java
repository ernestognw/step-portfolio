package com.google.sps.common;

import com.google.appengine.api.datastore.Query.SortDirection;

/**
 * DefaultParams is to standardize the params for the servlets.
 * Maybe in the future can be splitted in different files depending use case
 */
public interface DefaultParams {
  int page = 1;
  int pageSize = 5;
  SortDirection order = SortDirection.DESCENDING;
  String orderBy = "createdAt";
}