import useNodeStore from '../../store/nodeStore';
import {
  iNodeConnector,
  iNodeLists,
  iNodeRepliesFlow
} from '../../types/store/node';
import {
  createNodeConnector,
  createNodeList,
  createNodeReply,
  getNodeConnector
} from './flow';

export const createNodeReplyHandler = async (
  nodeReplies: iNodeRepliesFlow[]
) => {
  const nodeRepliesadded = await createNodeReply(nodeReplies);
  return true;
};

export const createNodeListHandler = async (nodeLists: iNodeLists[]) => {
  const nodeListsadded = await createNodeList(nodeLists);
  return true;
};

export const getNodeConnectorHandler = async () => {
  const { setNodeConnector } = useNodeStore.getState();
  const nodeConnectors = await getNodeConnector();
  setNodeConnector(nodeConnectors);
};

export const createNodeConnectorHandler = async (nodeData: iNodeConnector) => {
  const { nodeConnector, setNodeConnector } = useNodeStore.getState();
  const nodeConnectorAdded = await createNodeConnector(nodeData);
  setNodeConnector([...nodeConnector, nodeConnectorAdded]);
};
