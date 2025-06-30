package com.healzy.security;

public interface FilterChain {
    void doFilter(ServletRequest request, ServletResponse response);
}
