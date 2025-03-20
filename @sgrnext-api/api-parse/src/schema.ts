export type Schema = Record<string, KeySchema>;

export type KeySchema = {
  source: string;
  path: string[];
  cast: string[];
}

export function compileSchema(
  schema: Record<string, string>
): Record<string, KeySchema> {
  const result: Record<string, KeySchema> = {};

  for (const [ key, keySchema ] of Object.entries(schema)) {
    result[key] = compileSchemaKey(keySchema);
  }

  return result;
}

export function compileSchemaKey(schema: string): KeySchema {
  const result = { path: [], cast: [] } as unknown as KeySchema;
  
  let phase = 'source' as 'source' | 'path' | 'cast';
  let chars = [];
  let isEscaped = false;
  for (let i = 0; i <= schema.length; i++) {
    const char = schema[i];

    if (isEscaped) {
      if (char !== '\\' && char !== '.' && char !== ':') {
        throw new Error(`Invalid escape sequence: \\${char != null ? char : 'EOS'}`);
      }

      chars.push(char);
      isEscaped = false;
      continue;
    }

    if (char === '\\') {
      isEscaped = true;
      continue;
    }

    if (char != null && char !== '.' && char !== ':') {
      chars.push(char);
      continue;
    }

    const value = chars.join('');
    chars = [];
    switch (phase) {
      case 'source':
        result.source = value;
        phase = char === ':' ? 'cast' : 'path';
        break;
        
      case 'path':
        result.path.push(value);
        phase = char === ':' ? 'cast' : 'path';
        break;

      case 'cast':
        if (char === '.') {
          throw new Error('Unhandled symbol: "." in cast');
        }
        result.cast.push(value);
        break;
    }
  }

  return result;
}
