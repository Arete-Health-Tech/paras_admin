export interface iNodeConnector {
  serviceId: string;
  templateName: string;
  templateLanguage: string;
  templateIdentifier: string;
  nodeId: string;
  nodeIdentifier: string;
}
export interface iNodeRepliesFlow {
  _id?: string;
  diseaseId: string;
  nodeId: string;
  nodeName: string;
  headerType: string;
  headerLink: string;
  body: string;
  footer: string;
  replyButton1: string;
  replyButtonId1: string;
  replyButton2: string;
  replyButtonId2: string;
  replyButton3: string;
  replyButtonId3: string;
}

export interface iNodeLists {
  disease: string;
  nodeId: string;
  nodeName: string;
  headerType: string;
  headerLink: string;
  body: string;
  footer: string;
  menuTitle: string;
  sectionTitle: string;
  listTitle0: string;
  listDesc0: string;
  listId0: string;
  listTitle1: string;
  listDesc1: string;
  listId1: string;
  listTitle2: string;
  listDesc2: string;
  listId2: string;
  listTitle3: string;
  listDesc3: string;
  listId3: string;
  listTitle4: string;
  listDesc4: string;
  listId4: string;
  listTitle5: string;
  listDesc5: string;
  listId5: string;
  listTitle6: string;
  listDesc6: string;
  listId6: string;
  listTitle7: string;
  listDesc7: string;
  listId7: string;
  listTitle8: string;
  listDesc8: string;
  listId8: string;
  listTitle9: string;
  listDesc9: string;
  listId9: string;
}

export interface iNodeListsMesaage {
  nodeId: string;
  nodeName: string;
  headerType?: string;
  headerLink?: string;
  body: string;
  footer: string;
  menuTitle: string;
  sectionTitle: string;
  listTitle0?: string;
  listDesc0?: string;
  listId0?: string;
  listTitle1?: string;
  listDesc1?: string;
  listId1?: string;
  listTitle2?: string;
  listDesc2?: string;
  listId2?: string;
  listTitle3?: string;
  listDesc3?: string;
  listId3?: string;
  listTitle4?: string;
  listDesc4?: string;
  listId4?: string;
  listTitle5?: string;
  listDesc5?: string;
  listId5?: string;
  listTitle6?: string;
  listDesc6?: string;
  listId6?: string;
  listTitle7?: string;
  listDesc7?: string;
  listId7?: string;
  listTitle8?: string;
  listDesc8?: string;
  listId8?: string;
  listTitle9?: string;
  listDesc9?: string;
  listId9?: string;
  type: string;
}

export interface iNodeStore {
  nodeConnector: iNodeConnector[];
  setNodeConnector: (nodeConnector: iNodeConnector[]) => void;
}
