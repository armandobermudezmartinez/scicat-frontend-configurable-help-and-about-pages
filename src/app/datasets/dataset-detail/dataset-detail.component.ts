import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {OrigDatablock, RawDataset} from 'shared/sdk/models';
import * as dsa from 'state-management/actions/datasets.actions';

/**
 * Component to show details for a dataset, using the
 * form compoennt
 * @export
 * @class DatasetDetailComponent
 * @implements {OnInit}
 */
@Component({
  selector : 'dataset-detail',
  templateUrl : './dataset-detail.component.html',
  styleUrls : [ './dataset-detail.component.css' ]
})
export class DatasetDetailComponent implements OnInit, OnDestroy {

  dataset: RawDataset = undefined;
  dataBlocks: Array<OrigDatablock>;
  error;

  subscriptions = [];

  constructor(private route: ActivatedRoute,
              private store: Store<any>) {
  };

  ngOnInit() {
    const self = this;


    this.subscriptions.push(this.store.select(state => state.root.datasets.currentSet)
        .subscribe(dataset => {
          if (dataset && Object.keys(dataset).length > 0) {
            this.dataset = <RawDataset>dataset;
            console.log(this.dataset);
            if (!('origdatablocks' in this.dataset)) {
              this.store.dispatch(
                  {type : dsa.DATABLOCKS, payload : this.dataset.pid});
            }
            this.store.dispatch({type: dsa.SELECT_CURRENT, payload: undefined});
          }
        }));

    this.store.select(state => state.root.datasets.currentSet).take(1).subscribe(ds => {
      if (!ds) {
        this.route.params.subscribe(params => {
          this.store.dispatch({type : dsa.SEARCH_ID, payload : params.id});
        });
      }
    });
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }
}
