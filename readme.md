# workime

## Introduction

This tool is *supposed* to help to manage and analyze **work** t**ime**.

It should do so by having these features and (or) allowing these actions defined in below sections:

### Functional Requirements

- Defining projects
- Assigning notes and attachments to projects in a linear timeline
    - Pin note(s) and jump to pinned note(s)
- Previewing attachments within application
    - Be able to open externally
- Defining time spent onto notes
    - Allow to edit time spent per note
    - See total time spent in project
- Keep history of projects and their accumulated data
- Define work days, work hours, lunch time and minimum required time to be spent per work day
    - Be informed if some days had hours overflow or the opposite, didn't meet minimum requirements
    - Be informed if you should go on a lunch break

### Non-Functional Requirements

1. Application should work for both: **Windows** and **Linux**
2. Application should be able to live as a background service <small>*(To send notifications)*</small>
3. Data should be embedded <small>*(May change in the future)*</small>

## Implementation

Stack for this application consists of

- Rust <small>*(logic)*</small>
- sqlx <small>(SQLite) *(data handler)*</small>
- Tauri <small>(Svelte) *(user interface)*</small>
- *...and more*

## Showcase

```rs
crate::todo();
```
