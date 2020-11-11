const click = (elem) => {
	const evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	const canceled = !elem.dispatchEvent(evt);
};

const tabNode = (() => {
  var count = 0;
  return () => {clickNode(count++)}
})();

const clickNode = count => {
  const nodes = document.getElementsByClassName('tree-node');
  if (nodes.length > 0) {
    const index = count % nodes.length;
    click(nodes[index]);
  }
};

const save = () => {
  const xpath = "//div[text()='Save & Activate']";
  click(document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
}

const getcontrols = () => {
  const stepcontrols = document.getElementsByClassName("step-controls");
  if (stepcontrols.length > 0) {
    const controls = stepcontrols[0].childNodes;
    const showontree = controls[0];
    const splittree = controls[2];
    const clonetree = controls[4];
    const deletetree = controls[6];
    return {showontree, splittree, clonetree, deletetree};  
  }
  return {};
}

chrome.runtime.onMessage.addListener(function (command) {
  switch (command) {
    case 'save-activate':
      save();
      break;
    case 'tab-node':
      tabNode();
      break;
    case 'show-on-tree':
      getcontrols().showontree.click();
      break;
    case 'split-tree': 
      getcontrols().splittree.click();
      break;
    case 'clone-tree': 
      getcontrols().clonetree.click();
      break;
    case 'delete-tree': 
      getcontrols().deletetree.click();
      break;
  }
});

