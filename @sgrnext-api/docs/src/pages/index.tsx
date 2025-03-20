import ArticleIcon from '@mui/icons-material/Article';
import ExtensionIcon from '@mui/icons-material/Extension';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Box, Button, Divider, Typography } from '@mui/material';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import type {ReactNode} from 'react';
import './index.module.css';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout
      title={`@sgrnext/api`}
      description="We're here to sweeten your API "
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column',
          mb: 4
        }}>
        <Typography variant="h1" sx={{ mt: 4, mb: 4, fontSize: '4rem' }}>
          @sgrnext/api
        </Typography>
        <Typography variant="subtitle1">
          Sweetin' your API
        </Typography>
      </Box>
      <Divider />
      <Box 
        sx={{
          width: 'calc(100% - 32px)',
          maxWidth: '1024px',
          mb: 4,
          ml: 'auto',
          mr: 'auto'
        }}
      >
        <Box sx={{ mt: 4, mb: 4, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            size="large" 
            href="/docs/@sgrnext/api/introduction"
            startIcon={<ArticleIcon />}
          >
            Documentation
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            size="large" 
            href="/docs/plugins"
            startIcon={<ExtensionIcon />}
          >
            Plugins
          </Button>
        </Box>
        <Tabs>
          <TabItem value="handler" label="Handler" default>
            <CodeBlock language="typescript" title="src/app/api/books/route.ts">
              {`import { compileSchema } from '@sgrnext/api-parse';
import { z } from "zod";
import { handlers } from '@/server/handlers';

export POST = handlers.create(async (env) => {
  const { title, price } = await env.parse(SCHEMA, ZOD_SCHEMA)
  const { id } = await env.pool.execute('...', [ title, price ]);

  return { id };
});

const SCHEMA = compileSchema({ title: 'body', price: 'body' });
const ZOD_SCHEMA = z.object({ title: z.string(), price: z.number() });`}
            </CodeBlock>
          </TabItem>
          <TabItem value="factory" label="Factory">
            <CodeBlock language="typescript" title="src/server/handlers.ts">
              {`import { HandlerFactory } from '@sgrnext/api';
import { parse } from "@sgrnext/api-parse";

export const handlers = new HandlerFactory()
  // apply plugins
  .plugin({ pool: myDatabaseConnection })
  .plugin(parse())
  ...
;`}
            </CodeBlock>
          </TabItem>
        </Tabs>
      </Box>
    </Layout>
  );
}
