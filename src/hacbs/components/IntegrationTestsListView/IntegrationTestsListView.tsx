import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Spinner,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Flex, FlexItem } from '@patternfly/react-core/dist/js/layouts';
import { CodeBranchIcon } from '@patternfly/react-icons/dist/esm/icons/code-branch-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { FilterIcon, SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { Table } from '../../../shared';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { IntegrationTestScenarioGroupVersionKind } from '../../models';
import { IntegrationTestScenarioKind } from '../../types/coreBuildService';
import { IntegrationTestListHeader } from './IntegrationTestListHeader';
import IntegrationTestListRow from './IntegrationTestListRow';

type IntegrationTestsListViewProps = {
  applicationName: string;
};

const IntegrationTestsEmptyState: React.FC = () => (
  <EmptyState data-test="integration-tests__empty">
    <EmptyStateIcon icon={CodeBranchIcon} />
    <Title headingLevel="h4" size="lg">
      Add an integration test pipeline to test all your components after you commit code
    </Title>
    <EmptyStateBody>
      No integration test pipelines found yet.
      <br />
      To get started, create an environment or connect to a release environment.
      <ExternalLink
        href="#"
        text={
          <Flex
            className="pf-u-mt-sm"
            spaceItems={{ default: 'spaceItemsXs' }}
            justifyContent={{ default: 'justifyContentCenter' }}
          >
            <FlexItem>Learn more about setting up an integration test pipeline</FlexItem>
            <FlexItem>
              <ExternalLinkAltIcon />
            </FlexItem>
          </Flex>
        }
      />
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button isDisabled component={(props) => <Link {...props} to="#" />} variant="primary">
        Add integration test
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

const IntegrationTestsFilteredState: React.FC<{ onClearFilters: () => void }> = ({
  onClearFilters,
}) => (
  <EmptyState data-test="integration-tests__all-filtered">
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h2" size="lg">
      No results found
    </Title>
    <EmptyStateBody>
      No results match the filter criteria. Remove filters or clear all filters to show results.
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button variant="link" onClick={onClearFilters} data-test="integration-tests__clear-filters">
        Clear all filters
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);
const IntegrationTestsListView: React.FC<IntegrationTestsListViewProps> = ({ applicationName }) => {
  const namespace = useNamespace();
  const [integrationTests, integrationTestsLoaded] = useK8sWatchResource<
    IntegrationTestScenarioKind[]
  >({
    groupVersionKind: IntegrationTestScenarioGroupVersionKind,
    namespace,
    isList: true,
  });
  const [nameFilter, setNameFilter] = React.useState<string>('');

  const applicationIntegrationTests = React.useMemo(
    () =>
      integrationTestsLoaded
        ? integrationTests?.filter((test) => test.spec.application === applicationName)
        : [],
    [integrationTests, applicationName, integrationTestsLoaded],
  );

  const filteredIntegrationTests = React.useMemo(
    () =>
      nameFilter
        ? applicationIntegrationTests.filter(
            (test) => test.metadata.name.indexOf(nameFilter) !== -1,
          )
        : applicationIntegrationTests,
    [nameFilter, applicationIntegrationTests],
  );

  const loading = (
    <Bullseye className="pf-u-mt-md" data-test="integration-tests__loading">
      <Spinner />
    </Bullseye>
  );

  if (!integrationTestsLoaded) {
    return loading;
  }

  if (!applicationIntegrationTests?.length) {
    return <IntegrationTestsEmptyState />;
  }
  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);

  return (
    <>
      <Title headingLevel="h4" className="pf-u-mt-lg pf-u-mb-sm">
        Integration test pipelines
      </Title>
      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
        <FlexItem>
          <TextContent>
            <Text component={TextVariants.small}>
              Add an integration test pipeline to test all your components after you commit code.
            </Text>
          </TextContent>
        </FlexItem>
        <FlexItem>
          <ExternalLink
            href="#"
            text={
              <Flex
                spaceItems={{ default: 'spaceItemsXs' }}
                justifyContent={{ default: 'justifyContentCenter' }}
              >
                <FlexItem className="pf-u-font-size-sm">
                  Learn more about setting up an integration test pipeline
                </FlexItem>
                <FlexItem>
                  <ExternalLinkAltIcon />
                </FlexItem>
              </Flex>
            }
          />
        </FlexItem>
      </Flex>
      <>
        <Toolbar data-testid="component-list-toolbar" clearAllFilters={onClearFilters}>
          <ToolbarContent>
            <ToolbarGroup alignment={{ default: 'alignLeft' }}>
              <ToolbarItem>
                <Button variant="control">
                  <FilterIcon /> {'Name'}
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <TextInput
                  name="nameInput"
                  data-test="name-input-filter"
                  type="search"
                  aria-label="name filter"
                  placeholder="Filter by name..."
                  onChange={(name) => onNameInput(name)}
                  value={nameFilter}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
        {filteredIntegrationTests.length ? (
          <Table
            data-test="integration-tests__table"
            data={filteredIntegrationTests}
            aria-label="Integration tests"
            Header={IntegrationTestListHeader}
            Row={IntegrationTestListRow}
            loaded
            getRowProps={(obj: IntegrationTestScenarioKind) => ({
              id: obj.metadata.name,
            })}
          />
        ) : (
          <IntegrationTestsFilteredState onClearFilters={onClearFilters} />
        )}
      </>
    </>
  );
};

export default IntegrationTestsListView;
