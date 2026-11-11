import * as React from 'react';
import {
  Button,
  Dropdown,
  Field,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  Option,
  Spinner,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { GeneratedComponentProps } from './RuntimeTypes';

type PageErrorKind = 'write' | 'indeterminate' | 'network' | 'render';

type PageErrorView = {
  message: string;
  fallback: string;
  kind: PageErrorKind;
  retry?: () => void;
};

type ActionResult = {
  ok: boolean;
  indeterminate?: boolean;
  outputs?: Record<string, unknown>;
  error?: { code?: string; message?: string };
};

type CustomApiDataApi = {
  executeAction?: (request: {
    name: string;
    parameters?: Record<string, unknown>;
    boundTo?: { entityName: string; id: string };
  }) => Promise<ActionResult>;
};

const PAGE_NAME = 'Qualify Inquiry';
const WON_VALUE = 629350005;
const LOST_VALUE = 629350004;

const useStyles = makeStyles({
  root: {
    position: 'relative',
    contain: 'layout',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: tokens.spacingHorizontalXL,
    gap: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground2,
  },
});

function reportPageError(
  operation: string,
  code: unknown,
  message: unknown,
  kind: PageErrorKind,
  retry?: () => void,
): PageErrorView {
  const sanitizedMessage =
    typeof message === 'string'
      ? message
          .trim()
          .split(/[\r\n\u2028\u2029]/)[0]
          .replace(/[\s\u0000-\u001f\u007f-\u009f]+/g, ' ')
          .trim()
          .slice(0, 300)
      : '';
  const sanitizedCode =
    typeof code === 'string' || typeof code === 'number'
      ? String(code).replace(/[\s\u0000-\u001f\u007f-\u009f]+/g, ' ').trim().slice(0, 80)
      : '';

  console.error('[' + PAGE_NAME + '] ' + operation + ' failed', {
    code: sanitizedCode,
    message: sanitizedMessage,
  });

  const fallback =
    kind === 'network'
      ? 'The request did not go through. You can try again.'
      : kind === 'indeterminate'
        ? "We couldn't confirm the inquiry was qualified. Refresh before trying again."
        : kind === 'render'
          ? 'This page could not render. Refresh the page.'
          : 'The inquiry could not be qualified. Refresh before trying again.';

  return {
    message: kind === 'indeterminate' || kind === 'render' ? '' : sanitizedMessage,
    fallback,
    kind,
    retry: kind === 'network' ? retry : undefined,
  };
}

function PageErrorBar(props: { error: PageErrorView | null }) {
  if (!props.error) {
    return null;
  }

  return (
    <MessageBar intent="error">
      <MessageBarBody>{props.error.message || props.error.fallback}</MessageBarBody>
      {props.error.retry && (
        <MessageBarActions>
          <Button onClick={props.error.retry}>Try again</Button>
        </MessageBarActions>
      )}
    </MessageBar>
  );
}

class PageErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  public state = { failed: false };

  public static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  public componentDidCatch(error: Error): void {
    reportPageError('render', undefined, error.message, 'render');
  }

  public render(): React.ReactNode {
    if (this.state.failed) {
      return (
        <MessageBar intent="error">
          <MessageBarBody>This page could not render. Refresh the page.</MessageBarBody>
        </MessageBar>
      );
    }

    return this.props.children;
  }
}

function PageBody(props: GeneratedComponentProps) {
  const styles = useStyles();
  const recordId = props.pageInput?.recordId ?? '';
  const actionApi = props.dataApi as unknown as CustomApiDataApi;
  const [status, setStatus] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<PageErrorView | null>(null);
  const pending = React.useRef(false);

  async function closeDialog() {
    const xrm = (window as any).Xrm;
    await xrm.Navigation.navigateBack();
  }

  async function submitQualification(statusValue: number) {
    if (pending.current || typeof actionApi.executeAction !== 'function' || !recordId) {
      return;
    }

    pending.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const response = await actionApi.executeAction({
        name: 'voy_QualifyInquiry',
        parameters: { Status: statusValue },
        boundTo: { entityName: 'voy_travelinquiry', id: recordId },
      });

      if (response.indeterminate || response.error?.code === 'indeterminate') {
        setError(reportPageError('qualifyInquiry', response.error?.code, response.error?.message, 'indeterminate'));
        return;
      }

      if (!response.ok && response.error?.code === 'network') {
        setError(
          reportPageError('qualifyInquiry', response.error?.code, response.error?.message, 'network', () => {
            if (status !== null) {
              void submitQualification(status);
            }
          }),
        );
        return;
      }

      if (!response.ok) {
        setError(reportPageError('qualifyInquiry', response.error?.code, response.error?.message, 'write'));
        return;
      }

      const quoteId = response.outputs?.QuoteId;
      if (quoteId !== undefined && typeof quoteId !== 'string') {
        setError(reportPageError('qualifyInquiry', 'invalid_output', 'The action returned an invalid result.', 'write'));
        return;
      }

      await closeDialog();
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : undefined;
      setError(reportPageError('qualifyInquiry', undefined, message, 'write'));
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  function handleSubmit() {
    if (!recordId) {
      setError(reportPageError('qualifyInquiry', 'missing_record', 'Open this page from a travel inquiry record.', 'write'));
      return;
    }

    if (typeof actionApi.executeAction !== 'function') {
      setError(reportPageError('qualifyInquiry', 'not_available', 'This runtime does not support the qualification action.', 'write'));
      return;
    }

    if (status !== null) {
      void submitQualification(status);
    }
  }

  return (
    <main className={styles.root} aria-labelledby="qualify-inquiry-title">
      <header className={styles.header}>
        <Text as="h1" id="qualify-inquiry-title" size={500} weight="semibold">
          Qualify inquiry
        </Text>
        <Text>
          Choose whether this travel inquiry was won or lost. This action cannot be undone from this dialog.
        </Text>
      </header>

      <PageErrorBar error={error} />

      <section className={styles.content} aria-label="Qualification details">
        {!recordId && (
          <MessageBar intent="warning">
            <MessageBarBody>Open this page from a travel inquiry record before submitting.</MessageBarBody>
          </MessageBar>
        )}

        <Field label="Status reason" required>
          <Dropdown
            aria-label="Status reason"
            placeholder="Select Won or Lost"
            selectedOptions={status === null ? [] : [String(status)]}
            onOptionSelect={(_, data) => setStatus(data.optionValue ? Number(data.optionValue) : null)}
            disabled={submitting}
          >
            <Option value={String(WON_VALUE)}>Won</Option>
            <Option value={String(LOST_VALUE)}>Lost</Option>
          </Dropdown>
        </Field>
      </section>

      <footer className={styles.actions}>
        {submitting && (
          <span className={styles.status} aria-live="polite">
            <Spinner size="tiny" /> Qualifying inquiry
          </span>
        )}
        <Button appearance="secondary" onClick={closeDialog} disabled={submitting}>
          Cancel
        </Button>
        <Button appearance="primary" onClick={handleSubmit} disabled={status === null || submitting || !recordId}>
          Submit
        </Button>
      </footer>
    </main>
  );
}

const GeneratedComponent = (props: GeneratedComponentProps) => (
  <PageErrorBoundary>
    <PageBody {...props} />
  </PageErrorBoundary>
);

export default GeneratedComponent;
