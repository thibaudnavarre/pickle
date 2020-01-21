const I = actor();
const FeatureBoardLocators = require('./locators/board-feature-locators');
const FeatureBoardClass = require('./helpers/feature-board-helper');
const FeatureBoardHelper = new FeatureBoardClass(I);

Given('les scénarios suivant sont enregistrés :', (scTable) => {
    scTable.parse().hashes().forEach((sc, index) => {
        if(index === 0){
            FeatureBoardHelper.renameLastScenario(sc.name);
        } else {
            FeatureBoardHelper.addScenario(sc.name);
        }
    })
});

When('je clique sur l\'option d\'ajout d\'un scénario', () => {
    FeatureBoardHelper.addScenario();
});

When('j\'ajoute les steps suivants :', (stepsTable) => {
    let indexScenario;
    stepsTable.parse().hashes().forEach((step) => {
        indexScenario = step.scenarioNumber ? step.scenarioNumber : 1;
        FeatureBoardHelper.addStep(indexScenario, step.sectionName, step.stepName);
    });
});

When('je supprime le scenario en position {int}', (position) => {
    FeatureBoardHelper.deleteScenario(position);
});

Then('la feature contient {int} scénarios', (nbScenarios) => {
    I.seeNumberOfElements('scenario-builder',nbScenarios)
});

Then('les steps suivant ne sont pas présents :', (stepsTable) => {
    let indexScenario;
    stepsTable.parse().hashes().forEach((step) => {
        indexScenario = step.scenarioNumber ? step.scenarioNumber : 1;
        I.dontSee(step.stepName, 
            FeatureBoardLocators.scenarioSection(indexScenario, step.sectionName)
        );
    });
});

Then('la feature contient les scénarios dans l\'ordre suivant :', (scTable) => {
    scTable.parse().hashes().forEach((sc, index) => {
        I.see(sc.name, FeatureBoardLocators.scenarioName(index+1));
    })
});
