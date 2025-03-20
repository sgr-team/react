---
slug: /plugins/@sgrnext/api-parse/sources
title: Sources
sidebar_position: 1
---

# Sources

With @sgrnext/api-parse, you have the option to utilize its built-in sources such as body, 
query, or define your own [custom sources](./custom.md).

<table>
  <thead>
    <tr>
      <td>Source</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>[Body(json)](./body-json.md)</td>
      <td>
        Provides access to the request body as a JSON object
      </td>
    </tr>
    <tr>
      <td>[Body(text)](./body-text.md)</td>
      <td>
        Provides access to the request body as a raw string, allowing 
        you to retrieve the unparsed text content directly
      </td>
    </tr>
    <tr>
      <td>[Cookies](./cookies.md)</td>
      <td>
        Grants access to the cookies included in the NextRequest, enabling 
        extraction of cookie values
      </td>
    </tr>
    <tr>
      <td>[Headers](./headers.md)</td>
      <td>
        Offers access to the request headers, allowing retrieval of header 
        fields as key-value pairs
      </td>
    </tr>
    <tr>
      <td>[Params](./params.md)</td>
      <td>
        Provides access to route parameters, facilitating the extraction 
        of dynamic values from the URL structure
      </td>
    </tr>
    <tr>
      <td>[Query](./query.md)</td>
      <td>
        Enables access to the query parameters of the NextRequest, allowing 
        retrieval of key-value pairs from the URL’s query string
      </td>
    </tr>
  </tbody>
</table>
