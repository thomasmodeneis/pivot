'use strict';

import React = require('react');
import { $, Expression, Datum, Dataset, NativeDataset, TimeRange, Dispatcher } from 'plywood';
import { Filter, Dimension, Measure, SplitCombine, Clicker, DataSource } from "../../models/index";

import { HeaderBar } from '../header-bar/header-bar';
import { TimeSeriesVis } from '../time-series-vis/time-series-vis';
import { NestedTableVis } from '../nested-table-vis/nested-table-vis';
import { FilterSplitPanel } from '../filter-split-panel/filter-split-panel';
import { VisBar } from '../vis-bar/vis-bar';
import { DropIndicator } from '../drop-indicator/drop-indicator';


interface ApplicationProps {
  dataSources: DataSource[];
}

interface ApplicationState {
  filter?: Filter;
  splits?: SplitCombine[];
  dragOver?: boolean;
}

export class Application extends React.Component<ApplicationProps, ApplicationState> {
  private clicker: Clicker;
  private dragCounter: number;

  constructor() {
    super();
    this.state = {
      filter: new Filter([
        $('time').in(TimeRange.fromJS({
          start: new Date('2013-02-26T00:00:00Z'),
          end: new Date('2013-02-27T00:00:00Z')
        }))
      ])
    };

    var self = this;
    this.clicker = {
      setFilter: (filter: Filter) => {
        self.setState({ filter });
      },
      changeSplits: (splits: SplitCombine[]) => {

      },
      addSplit: (split: SplitCombine) => {

      }
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  dragOver(e: DragEvent) {
    e.preventDefault();
  }

  dragEnter(e: DragEvent) {
    var { dragOver } = this.state;
    if (!dragOver) {
      this.dragCounter = 0;
      this.setState({
        dragOver: true
      });
    } else {
      this.dragCounter++;
    }
  }

  dragLeave(e: DragEvent) {
    var { dragOver } = this.state;
    if (!dragOver) return;
    if (this.dragCounter === 0) {
      this.setState({
        dragOver: false
      });
    } else {
      this.dragCounter--;
    }
  }

  drop(e: DragEvent) {
    this.dragCounter = 0;
    this.setState({
      dragOver: false
    });
    console.log('drop into vis');
  }

  render() {
    var clicker = this.clicker;
    var { dataSources } = this.props;
    var { filter, splits, dragOver } = this.state;

    var dataSource = dataSources[0];
    var { dispatcher, dimensions, measures } = dataSource;

    // <TimeSeriesVis dispatcher={basicDispatcher} filter={filter} measures={measures}/>

    var visualization = JSX(`
      <NestedTableVis dispatcher={dispatcher} filter={filter} measures={measures}/>
    `);

    var dropIndicator: React.ReactElement<any> = null;
    if (dragOver) {
      dropIndicator = JSX(`<DropIndicator/>`);
    }

    return JSX(`
      <main className='explorer'>
        <HeaderBar dataSource={dataSource}/>
        <div className='container'>
          <FilterSplitPanel clicker={clicker} dispatcher={dispatcher} filter={filter} splits={splits} dimensions={dimensions}/>
          <div
            className='vis-pane'
            onDragOver={this.dragOver.bind(this)}
            onDragEnter={this.dragEnter.bind(this)}
            onDragLeave={this.dragLeave.bind(this)}
            onDrop={this.drop.bind(this)}
          >
            <VisBar/>
            <div className='visualization'>{visualization}</div>
            {dropIndicator}
          </div>
        </div>
      </main>
    `);
  }
}
