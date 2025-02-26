import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ModalVariant, Stack, StackItem } from '@patternfly/react-core';
import dayjs from 'dayjs';
import { WatchK8sResource } from '../../dynamic-plugin-sdk';
import PipelineRunLogs from '../../shared/components/pipeline-run-logs/PipelineRunLogs';
import { PipelineRunKind } from '../../shared/components/pipeline-run-logs/types';
import { PipelineRunGroupVersionKind } from '../../shared/components/pipeline-run-logs/utils';
import { EmptyBox, LoadingBox } from '../../shared/components/status-box/StatusBox';
import { ComponentKind } from '../../types';
import { BUILD_APPLICATION_LABEL, BUILD_COMPONENT_LABEL } from '../../utils/const';
import { ComponentProps, createModalLauncher } from '../modal/createModalLauncher';
import './BuildLogViewer.scss';
import { useModalLauncher } from '../modal/ModalProvider';

type BuildLogViewerProps = ComponentProps & {
  component: ComponentKind;
};

export const BuildLogViewer: React.FC<BuildLogViewerProps> = ({ component }) => {
  const watchResource: WatchK8sResource = React.useMemo(() => {
    return {
      groupVersionKind: PipelineRunGroupVersionKind,
      namespace: component.metadata.namespace,
      isList: true,
    };
  }, [component.metadata.namespace]);

  const [pipelineRuns, loaded, error] = useK8sWatchResource(watchResource);

  const pipelineRun = React.useMemo(() => {
    if (loaded && !error) {
      return (pipelineRuns as PipelineRunKind[])
        ?.filter?.(
          (plr) =>
            plr.metadata.labels[BUILD_COMPONENT_LABEL] === component.metadata.name &&
            plr.metadata.labels[BUILD_APPLICATION_LABEL] === component.spec.application,
        )
        ?.sort?.(
          (a, b) =>
            new Date(b.metadata.creationTimestamp).getTime() -
            new Date(a.metadata.creationTimestamp).getTime(),
        )?.[0];
    }
    return undefined;
  }, [pipelineRuns, component.metadata.name, component.spec.application, loaded, error]);

  if (loaded && !pipelineRun) {
    return <EmptyBox label="pipeline runs" />;
  }

  return (
    <Stack>
      <StackItem>
        <span style={{ marginRight: 'var(--pf-global--spacer--xl)' }}>
          {' '}
          Component: {component.metadata.name}
        </span>
        {pipelineRun && loaded && (
          <span>
            {' '}
            Build start date:{' '}
            {dayjs(new Date(pipelineRun.metadata.creationTimestamp)).format(
              'MMMM DD, YYYY, h:mm A',
            )}
          </span>
        )}
      </StackItem>
      <StackItem isFilled>
        {pipelineRun ? <PipelineRunLogs obj={pipelineRun} /> : <LoadingBox />}
      </StackItem>
    </Stack>
  );
};

export const buildLogViewerLauncher = createModalLauncher(BuildLogViewer, {
  className: 'build-log-viewer',
  'data-testid': 'view-build-logs-modal',
  variant: ModalVariant.large,
  title: 'View logs',
});

export const useBuildLogViewerModal = (component: ComponentKind) => {
  const showModal = useModalLauncher();
  return React.useCallback(
    () => showModal(buildLogViewerLauncher({ component })),
    [component, showModal],
  );
};
