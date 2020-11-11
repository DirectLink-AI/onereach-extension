const click = (elem) => {
	const evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
  const canceled = (elem != null) && !elem.dispatchEvent(evt);
};

const tabNode = (() => {
  var count = 0;
  const nodes = document.getElementsByClassName('tree-node');
  return () => {
    if (nodes.length > 0) {
      const index = count++ % nodes.length;
      click(nodes[index]);
    }
  }
})();

const saveActivate = () => {
  const xpath = "//div[text()='Save & Activate']";
  click(document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
}

const save = () => {
  const xpath = "//button[text()='Save Flow']";
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

const command = e => `${e.altKey && 'alt+' + e.key}` 

document.addEventListener('keydown', e => {
  if (document.getElementsByClassName('builder').length == 0) return;
  switch(command(e)) {
    case 'alt+a':
      tabNode();
      e.stopPropagation();
      break;
    case 'alt+q':
      confirm("Are you sure you want to delete this tree?") && getcontrols().deletetree.click();
      e.stopPropagation();
      break;
    case 'alt+c':
      getcontrols().clonetree.click();
      e.stopPropagation();
      break;
    case 'alt+g':
      getcontrols().showontree.click();
      e.stopPropagation();
      break;
    case 'alt+s':
      saveActivate();
      e.stopPropagation();
      break;
    case 'alt+x':
      getcontrols().splittree.click();
      e.stopPropagation();
      break;
  }
});

const everyMinute = () => {
  save();
  setTimeout(everyMinute, 60000)
};

const updateTitle = () => {
  const breadcrumbs = document.getElementsByClassName('breadcrumbs')
  if (breadcrumbs.length > 0) {
    const bot = breadcrumbs[0]?.children[1]?.children[0]?.innerText
    const flow = breadcrumbs[0]?.children[2]?.children[0]?.innerText
    document.title = `${bot} > ${flow}`;
  }
};

window.onload = () =>{
  setTimeout(updateTitle, 2000);
  everyMinute();
}

window.onhashchange = () => {
  setTimeout(updateTitle, 2000);
};