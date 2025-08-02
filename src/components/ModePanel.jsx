import React, { Component } from "react";
import SimplePanel from "./SimplePanel";
import {
	ButtonGroup,
	Button,
	Collapse,
	ButtonDropdown,
	DropdownToggle,
	DropdownItem,
	DropdownMenu
} from "reactstrap";
import { PlayModes } from "./PlayModes";
import GeometricSlider from "./Sliders/GeometricSlider";
import AdvancedRange from "./Sliders/AdvancedRange"
import AdvancedSlider from "./Sliders/AdvancedSlider"
import DiscreteSlider from "./Sliders/DiscreteSlider"
import Utils from "./Utils";
import { InitPreset } from "./PresetsLib";
import Tr, { TrRange } from "./Locale"
import Config from "./Config";
class ModePanel extends Component {
	state = {
		bpmStep: this.props.bpmStep,
		bpmRange: this.props.bpmRange,
		// currentBpm: this.props.bpmRange[0],
		playbackMode: this.props.playbackMode,
		playMode: this.props.playMode,
		stepsNum: this.props.stepsNum,
		exerciseTime: this.props.exerciseTime,
		bpmStepDropdownOpen: false,
		byTimeInterval: this.props.byTimeInterval,
		byBarInterval: this.props.byBarInterval,
		constantBpmSlider: this.props.constantBpmSlider,
		percentageTimeInterval: this.props.percentageTimeInterval,
		percentageDecrease: this.props.percentageDecrease
	}

	onAfterChange(e) {
		this.props.onChange()
	}

	onModeChange(newMode) {

		let newState = {...this.state};

		// maintain current bpm when changing to CONSTANT playmode
		if (newMode === PlayModes.CONSTANT && newMode !== this.state.playMode) {
			newState.constantBpmSlider =  this.props.transport.bpm.value;
		}
		newState.playMode = newMode;
		this.setState(newState, this.onAfterChange);
	}



	onBpmRangeChange(bpmRange) {
		this.setState({ bpmRange: bpmRange }, this.onAfterChange);
	}

	onBpmSliderChange = (value) => {
		this.setState({ constantBpmSlider: value }, this.onAfterChange);
	}

	onBpmStepChange() {
		this.setState(prevState => ({
			bpmStepDropdownOpen: !prevState.bpmStepDropdownOpen
		}));
	}

	onBpmStepSelect(value) {
		this.setState({ bpmStep: value }, this.onAfterChange);
	}

	setValue(o) {
		this.refs.byBarSlider.setValue(o.byBarInterval || InitPreset.byBarInterval)
		this.refs.byTimeSlider.setValue(o.byTimeInterval || InitPreset.byTimeInterval)
		// this.refs.exerciseTimeSlider.setValue(o.exerciseTime || InitPreset.exerciseTime);

		this.refs.bpmRange.setState({ bounds: o.bpmRange })
		
		// Set percentage sliders if they exist
		if (this.refs.percentageTimeSlider) {
			this.refs.percentageTimeSlider.setValue(o.percentageTimeInterval || InitPreset.percentageTimeInterval)
		}
		// Note: AdvancedSlider doesn't have setValue method, so we rely on state updates
		
		this.setState(
			{
				playMode: o.playMode,
				playbackMode: o.playbackMode || this.state.playbackMode,
				bpmStep: o.bpmStep,
				exerciseTime: o.exerciseTime || this.state.exerciseTime,
				stepsNum: o.stepsNum || this.state.stepsNum,
				byBarInterval: o.byBarInterval,// || this.state.byBarInterval,
				byTimeInterval: o.byTimeInterval, //|| this.state.byTimeInterval,
				bpmRange: o.bpmRange,
				constantBpmSlider: o.constantBpmSlider || this.state.constantBpmSlider,
				percentageTimeInterval: o.percentageTimeInterval || this.state.percentageTimeInterval,
				percentageDecrease: o.percentageDecrease || this.state.percentageDecrease
			},
			this.onAfterChange
		);

	}

	onTimeIntervalChange(v) {
		this.setState({ byTimeInterval: v, interval: v }, this.onAfterChange);
	}

	onBarIntervalChange(v) {
		this.setState({ byBarInterval: v, interval: v }, this.onAfterChange);
	}

	onPercentageTimeIntervalChange(v) {
		this.setState({ percentageTimeInterval: v }, this.onAfterChange);
	}

	onPercentageDecreaseChange(v) {
		this.setState({ percentageDecrease: v }, this.onAfterChange);
	}

	byBarFormatter(barsNum) {
		return barsNum + " " + TrRange(barsNum, "bars");
	}

	renderIncreaseBpmDropdown() {
		return (
			<>
				<ButtonDropdown
					style={{ margin: "0px 5px" }}
					isOpen={this.state.bpmStepDropdownOpen}
					toggle={() => this.onBpmStepChange()}
				>
					<DropdownToggle caret size="sm" outline color="light">
						{this.state.bpmStep}
					</DropdownToggle>
					<DropdownMenu>
						{[1,2,3,5,7,8,10,15,20,30,50].map(el => {
							return <DropdownItem key={"bpm_"+el} onClick={() => {this.onBpmStepSelect(el)}}>{el}</DropdownItem>
						})
					}
					</DropdownMenu>
				</ButtonDropdown>
				bpm
			</>
		);
	}

	onStepsSliderChange(value) {
		this.setState({ stepsNum: value }, this.onAfterChange);
	}

	onExerciseTimeSliderChange(value) {
		this.setState({ exerciseTime: value }, this.onAfterChange);
	}



	renderTimeSlider() {
		const marks = {}
		const mArr = [300,600,900,1200,1800,3600,7200,10800]

		mArr.map(el => {
			marks[el] = {value: el, label: Utils.formatTime(el)};
			return true;
		});
		return (<div>
			{Tr("Exercise Time")}
			<DiscreteSlider
				ref="exerciseTimeSlider"
				badgeFormatter={Utils.formatTimeLong}
				markFormatter={Utils.formatTime}
				marks={marks}
				value={this.state.exerciseTime}
				onChange={(value) => this.onExerciseTimeSliderChange(value)}
			/>

		</div>);
	}

	renderStepsSlider() {
		return (<div>
			{Tr("Number of steps")}
			<AdvancedSlider
				ref="stepsSlider"
				min={2}
				included={false}
				max={100}
				marks={{ 1: '1', 5: '5', 10: '10', 15: '15', 20: '20', 30: '30', 40: '40', 50: '50', 60: '60', 70: '70', 80: '80', 90: '90', 100: '100' }}
				value={this.state.stepsNum}
				onChange={(value) => this.onStepsSliderChange(value)}
			/>
		</div>);
	}
	renderSpeedRange() {
		return (<div>
			{Tr("BPM range")}
			<AdvancedRange
				ref="bpmRange"
				min={Config.MIN_BPM}
				max={Config.MAX_BPM}
				defaultValue={[
					this.state.bpmRange[0],
					this.state.bpmRange[1]
				]}
				editInPlace={true}
				pushable={true}
				onAfterChange={(value) => this.onBpmRangeChange(value)}
			/>
		</div>);
	}

	render() {
		return (
			<SimplePanel className="ModePanel" title="Mode" width="300px">
				<h6>{Tr('Increase speed')}</h6>
				<ButtonGroup size="sm">
					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.SET_TIME)}
						active={this.state.playMode === PlayModes.SET_TIME}
					>
						{Tr("Set time")}
					</Button>
					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.BY_BAR)}
						active={this.state.playMode === PlayModes.BY_BAR}
					>
						{Tr("By bar")}
					</Button>
					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.BY_TIME)}
						active={this.state.playMode === PlayModes.BY_TIME}
					>
						{Tr("By time")}
					</Button>
					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.PERCENTAGE_TIME)}
						active={this.state.playMode === PlayModes.PERCENTAGE_TIME}
					>
						{Tr("Percentage")}
					</Button>
					<Button
						size="sm"
						outline
						onClick={() => this.onModeChange(PlayModes.CONSTANT)}
						active={this.state.playMode === PlayModes.CONSTANT}
					>
						{Tr("Constant")}
					</Button>
				</ButtonGroup>

				<Collapse isOpen={this.state.playMode !== PlayModes.CONSTANT}>
					{this.renderSpeedRange()}
				</Collapse>

				<Collapse isOpen={this.state.playMode !== PlayModes.CONSTANT && this.state.playMode !== PlayModes.SET_TIME}>
					{this.renderIncreaseBpmDropdown()}
				</Collapse>

				<Collapse isOpen={this.state.playMode === PlayModes.CONSTANT}>
					<div>
						{Tr("BPM")}

						<AdvancedSlider
							ref="constantBpmSlider"
							title= {Tr("BPM")}
							included={false}
							editInPlace={true}
							min={Config.MIN_BPM}
							btnStep={10}
							max={Config.MAX_BPM}
							marks={{ 30: '30', 40: '40', 50: '50', 60: '60', 70: '70', 80: '80', 90: '90', 100: '100', 110: '110', 120: '120', 130: '130', 140: '140', 150: '150', 160: '160', 170: '170', 180: '180', 190: '190', 200: '200', 210: '210', 220: '220', 230: '230', 240: '240' }}
							value={this.state.constantBpmSlider}
							onChange={this.onBpmSliderChange}
						/>
					</div>
				</Collapse>

				<Collapse isOpen={this.state.playMode === PlayModes.SET_TIME}>
					{this.renderTimeSlider()}
					{this.renderStepsSlider()}
				</Collapse>

				<Collapse isOpen={this.state.playMode === PlayModes.BY_BAR}>

					<div>
						{Tr("Increase speed every")}
						<GeometricSlider
							ref="byBarSlider"
							defaultValue={this.state.byBarInterval}
							badgeFormatter={this.byBarFormatter}
							onChange={v => this.onBarIntervalChange(v)}
							min={1}
							max={301}
							marksAt={[1, 2, 5, 10, 20, 50, 100, 300]}
						/>
					</div>
				</Collapse>
				<Collapse isOpen={this.state.playMode === PlayModes.BY_TIME}>
					<div>

						{Tr("Increase speed every")}
						<GeometricSlider
							ref="byTimeSlider"
							defaultValue={this.state.byTimeInterval}
							badgeFormatter={Utils.formatTimeLong}
							markFormatter={Utils.formatTime}
							onChange={v => this.onTimeIntervalChange(v)}
							min={1}
							max={1200}
							marksAt={[1, 2, 5, 10, 30, 60, 120, 240, 600, 1200]}
						/>
					</div>
				</Collapse>
				<Collapse isOpen={this.state.playMode === PlayModes.PERCENTAGE_TIME}>
					<div>
						{Tr("Initial time interval")}
						<GeometricSlider
							ref="percentageTimeSlider"
							defaultValue={this.state.percentageTimeInterval}
							badgeFormatter={Utils.formatTimeLong}
							markFormatter={Utils.formatTime}
							onChange={v => this.onPercentageTimeIntervalChange(v)}
							min={1}
							max={1200}
							marksAt={[1, 2, 5, 10, 30, 60, 120, 240, 600, 1200]}
						/>
					</div>
					<div>
						{Tr("Time decrease percentage")}
						<AdvancedSlider
							ref="percentageDecreaseSlider"
							min={0}
							max={100}
							included={false}
							editInPlace={true}
							marks={{ 0: '0%', 10: '10%', 20: '20%', 30: '30%', 40: '40%', 50: '50%', 60: '60%', 70: '70%', 80: '80%', 90: '90%', 100: '100%' }}
							value={this.state.percentageDecrease}
							onChange={(value) => this.onPercentageDecreaseChange(value)}
						/>
					</div>
				</Collapse>

			</SimplePanel>
		);
	}
}

export default ModePanel;

ModePanel.defaultProps = {
	playMode: InitPreset.playMode,
	playbackMode: InitPreset.playbackMode,
	interval: InitPreset.interval,
	bpmStep: InitPreset.bpmStep,
	bpmRange: InitPreset.bpmRange,
	byTimeInterval: InitPreset.byTimeInterval,
	byBarInterval: InitPreset.byBarInterval,
	stepsNum: InitPreset.stepsNum,
	exerciseTime: InitPreset.exerciseTime,
	constantBpmSlider: InitPreset.constantBpmSlider,
	percentageTimeInterval: 20,
	percentageDecrease: 10,
	// currentBpm: InitPreset.bpmRange[0],
	onAfterChange: null
};
