import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeleteScenarioEventData } from '../scenario-builder/delete-scenario-event-data';
import { FeatureUpdaterService } from '../../services/updaters/feature-updater/feature-updater.service';
import { ScenarioUpdaterService } from '../../services/updaters/scenario-updater/scenario-updater.service';
import { EventUpdateType } from '../../libs/EventUpdateType.enums';
import { MatDialog } from '@angular/material/dialog';
import { GherkinGeneratorDialogComponent } from '../gherkin-generator-dialog/gherkin-generator-dialog.component';
import { FeatureAssemblyService } from '../../services/feature-assembly/feature-assembly.service';
import { BoardSocketSynchro } from '../../services/boardSynchronizer/board-socket-synchro.service';
import { BoardLoaderService } from '../../services/board-loader/board-loader.service';

@Component({
	selector: 'app-board-feature-page',
	templateUrl: './board-feature-page.component.html',
	styleUrls: ['./board-feature-page.component.scss']
})
export class BoardFeaturePageComponent implements OnInit, OnDestroy {
	scenarios: Map<string, string> = new Map<string, string>();

	constructor(
		private featureUpdaterService: FeatureUpdaterService,
		private scenarioUpdaterService: ScenarioUpdaterService,
		private featureAssemblyService: FeatureAssemblyService,
		private synchronizerService: BoardSocketSynchro,
		private dialog: MatDialog,
		private boardLoaderService: BoardLoaderService
	) {}

	ngOnInit() {
		this.boardLoaderService.loadFeature().then(() => {
			this.synchronizerService.startSynchronization();
		});
		this.scenarioUpdaterService.getObservable().subscribe((eventData) => {
			switch (eventData.updateType) {
				case EventUpdateType.DELETE:
					this.scenarios.delete(eventData.codeBlockId);
					break;
				case EventUpdateType.CREATE:
					this.scenarios.set(eventData.codeBlockId, eventData.name);
					break;
			}
		});
	}

	ngOnDestroy(): void {
		this.synchronizerService.stopSynchronization();
	}

	addScenario() {
		this.scenarioUpdaterService.updateData({
			name: '',
			codeBlockId: '',
			updateType: EventUpdateType.CREATE
		});
	}

	delScenario(delEventData: DeleteScenarioEventData) {
		this.scenarioUpdaterService.updateData({
			name: '',
			codeBlockId: delEventData.codeBlockId,
			updateType: EventUpdateType.DELETE
		});
	}

	updateName(updatedName) {
		this.featureUpdaterService.updateData({ name: updatedName });
	}

	openGenerator() {
		this.dialog.open(GherkinGeneratorDialogComponent, { width: '50%' });
	}

	shouldBeRendered(index:number, keyValueScenario:any): number {
    return keyValueScenario.key;
  }
}
