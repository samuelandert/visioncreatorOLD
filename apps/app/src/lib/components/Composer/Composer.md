# Composer.svelte Documentation

## Overview

Composer.svelte is a flexible and dynamic component composition system for Svelte applications. It allows for the creation of complex, nested layouts with dynamic component loading, state management, and advanced data fetching capabilities.

## Purpose

The main purposes of Composer.svelte are:

1. To provide a declarative way to define complex UI layouts
2. To dynamically load and render components based on configuration
3. To manage state for each component in the composition
4. To handle inter-component communication through events
5. To enable dynamic and efficient data fetching for components

## Design

Composer.svelte is designed around the concept of a composable UI, where each component (referred to as a "composer") can have its own layout, child components, and associated data. The design follows these key principles:

1. **Hierarchical Structure**: Composers can be nested, allowing for complex layouts.
2. **Dynamic Component Loading**: Components are loaded and rendered based on their configuration.
3. **Isolated State Management**: Each composer has its own store for state management.
4. **Flexible Layouts**: Grid-based layouts can be easily defined and scaled.
5. **Event-driven Communication**: Components can communicate using an event bus system.
6. **Dynamic Data Fetching**: Components can declare their data requirements, which are then fetched and mapped dynamically.

## Implementation

### Key Components

1. **Composer Configuration (IComposer interface)**:
   - `id`: Unique identifier for the composer
   - `layout`: Layout configuration (IComposerLayout)
   - `component`: The component to be rendered
   - `slot`: Grid area for positioning
   - `children`: Nested composer configurations
   - `data`: Initial data for the composer
   - `map`: Query configuration for data fetching
   - `authID`: Authentication ID

2. **Layout System**:
   - Uses CSS Grid for flexible layouts
   - Supports custom areas, columns, rows, and gaps
   - Implements a scaling system for responsive designs

3. **State Management**:
   - Each composer has its own store created using `createComposerStore`
   - Stores are accessible via `getComposerStore`

4. **Query System**:
   - Utilizes `createQuery` for data fetching
   - Supports dynamic querying through the `map` property
   - Allows for complex data transformations and nested queries

5. **Event Handling**:
   - Uses an event bus system for inter-component communication
   - Implements `setupEventMapper` for event mapping

### Key Functions

1. `loadComponentAndInitializeState`: Loads components and initializes their state
2. `computeLayoutStyle`: Generates CSS styles for layouts
3. `createScaledContainer`: Implements the scaling system for responsive designs
4. `resolveMap`: Recursively resolves the `map` property, executing queries and transforming data

## Dynamic Querying with Map Function

The `map` property in the composer configuration is a powerful feature that allows for dynamic data fetching and transformation. It leverages the `queryComposer` endpoint to execute queries and transform the results.

### Map Structure

The `map` property can contain:

- Simple key-value pairs for static data
- Complex objects for dynamic querying
- Arrays of objects for list data

### Query Object Structure

A query object within the `map` can have the following properties:

- `query`: The name of the query to execute
- `input`: Input parameters for the query (use 'authID' for the current user's ID)
- `prop`: The property to extract from the query result
- `display`: A template string for formatting the result
- `mapProps`: An object for mapping query results to component props

### Data Transformation

The `queryComposer` endpoint handles data transformation:

1. It executes the specified query with the given input
2. Extracts the specified property from the result
3. Applies any display formatting
4. Maps the results to the specified props if `mapProps` is provided

### Nested Queries

The `map` property supports nested queries, allowing for complex data structures to be built from multiple queries.

## Usage Example

Here's a generic example demonstrating the use of Composer.svelte:

```javascript
export const view = {
    id: 'MainContainer',
    layout: {
        areas: `
            "header"
            "content"
            "footer"
        `,
        rows: 'auto 1fr auto',
        gap: '1rem',
        overflow: 'auto',
        style: 'max-width: 1200px; margin: 0 auto;'
    },
    children: [
        {
            id: 'Header',
            component: 'Header',
            slot: 'header',
            map: {
                title: {
                    query: "queryUserInfo",
                    input: { id: 'authID' },
                    prop: "username"
                },
                notifications: {
                    query: "queryNotifications",
                    input: { id: 'authID' },
                    prop: "count"
                }
            }
        },
        {
            id: 'Content',
            component: 'DynamicContent',
            slot: 'content',
            map: {
                items: {
                    query: 'queryContentItems',
                    prop: 'items',
                    mapProps: {
                        title: "prop.name",
                        description: "prop.summary",
                        id: "prop.itemId"
                    }
                },
                userPreferences: {
                    query: 'queryUserPreferences',
                    input: { id: 'authID' },
                    prop: 'preferences'
                }
            }
        },
        {
            id: 'Footer',
            component: 'Footer',
            slot: 'footer',
            map: {
                copyright: "© 2024 Our Company",
                links: [
                    { text: "Home", url: "/" },
                    { text: "About", url: "/about" },
                    { text: "Contact", url: "/contact" }
                ]
            }
        }
    ]
}
```

This example demonstrates:

1. **Complex Layout**: The `MainContainer` uses a grid layout with three main areas.
2. **Component Composition**: Three child components (`Header`, `DynamicContent`, and `Footer`) are composed within the container.
3. **Dynamic Data Fetching**: The `Header` and `DynamicContent` components use the `map` property to declare their data requirements.
4. **Nested Queries**: The `DynamicContent` component demonstrates how to use multiple queries to fetch different pieces of data.
5. **Data Transformation**: The `items` query in `DynamicContent` shows how to map query results to component props.
6. **Static Data**: The `Footer` component demonstrates how to include static data in the `map`.

## Best Practices

1. Keep composer configurations modular and reusable.
2. Use meaningful IDs for composers to easily identify them in the application.
3. Leverage the query system for efficient and dynamic data fetching.
4. Use the `map` property to declaratively specify data requirements and transformations.
5. Utilize the event bus for loose coupling between components.
6. Take advantage of the layout system for responsive designs.
7. Break down complex UIs into smaller, manageable components.
8. Use the `authID` input parameter for queries that require the current user's ID.

## Conclusion

Composer.svelte provides a powerful and flexible system for creating dynamic, composable user interfaces in Svelte applications. Its dynamic querying capabilities, coupled with its layout system and state management, allow developers to create complex, data-driven UIs with ease and maintainability. The declarative nature of the composer configuration, especially the `map` property, enables a clear separation of concerns between UI structure, data requirements, and presentation logic.