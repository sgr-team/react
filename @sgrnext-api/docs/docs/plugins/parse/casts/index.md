---
slug: /plugins/@sgrnext/api-parse/casts
title: Casts
sidebar_position: 2
---

import CodeBlock from '@theme/CodeBlock';

# Casts

With @sgrnext/api-parse, you have the option to utilize its built-in casts such as number, 
string, or define your own [custom casts](./custom.md).

<table>
  <thead>
    <tr>
      <td>Cast</td>
      <td>Schema</td>
      <td>Behavior</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>[Array](./array.md)</td>
      <td><CodeBlock language="typescript" children={`{ field: "body:array" }`} /></td>
      <td><CodeBlock language="typescript" children={`Array.isArray(value) ? value : [ value ]`} /></td>
    </tr>
    <tr>
      <td>[Boolean](./boolean.md)</td>
      <td><CodeBlock language="typescript" children={`{ field: "query:boolean" }`} /></td>
      <td><CodeBlock language="typescript" children={`value === 'false' ? false : Boolean(value)`} /></td>
    </tr>
    <tr>
      <td>[Date](./date.md)</td>
      <td><CodeBlock language="typescript" children={`{ field: "query:number:date" }`} /></td>
      <td><CodeBlock language="typescript" children={`new Date(value)`} /></td>
    </tr>
    <tr>
      <td>[Number](./number.md)</td>
      <td><CodeBlock language="typescript" children={`{ field: "query:number" }`} /></td>
      <td><CodeBlock language="typescript" children={`Number(value)`} /></td>
    </tr>
    <tr>
      <td>[String](./string.md)</td>
      <td><CodeBlock language="typescript" children={`{ field: "body:string" }`} /></td>
      <td><CodeBlock language="typescript" children={`String(value)`} /></td>
    </tr>
  </tbody>
</table>
