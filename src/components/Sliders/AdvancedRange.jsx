import React from "react";
import { Range } from "rc-slider";
import { Badge, Button } from "reactstrap";
import RangeEditInPlace from "./RangeEditInPlace";

class AdvancedRange extends Range {
	onBadgeClick() {
		this.refs.editor.open();
	}

	onEdit(v) {
		this.setState({ bounds: [v.min, v.max] }, () => this.props.onAfterChange(this.state.bounds))

	}

	onMinusClick = (value) => {
		const currentBounds = this.state.bounds;
		const newMin = Math.max(this.props.min, currentBounds[0] - value);
		const newMax = Math.min(this.props.max, currentBounds[1] - value);
		// Ensure min doesn't exceed max
		const adjustedMin = Math.min(newMin, newMax - 1);
		this.setState({ bounds: [adjustedMin, newMax] }, () => this.props.onAfterChange(this.state.bounds));
	}

	onPlusClick = (value) => {
		const currentBounds = this.state.bounds;
		const newMin = Math.max(this.props.min, currentBounds[0] + value);
		const newMax = Math.min(this.props.max, currentBounds[1] + value);
		// Ensure max doesn't go below min
		const adjustedMax = Math.max(newMax, newMin + 1);
		this.setState({ bounds: [newMin, adjustedMax] }, () => this.props.onAfterChange(this.state.bounds));
	}

	render() {
		const btnStep = this.props.btnStep || 5;
		return (
			<>
				<div className="advancedRange">
					<Button size="sm" outline className="inlineBtn" onClick={() => this.onMinusClick(btnStep)}>-{btnStep}</Button>
					<Badge
						color="light"
						onClick={this.props.editInPlace ? () => this.onBadgeClick() : function () { }}
						className={this.props.editInPlace ? "clickable" : ''}
					>
						{this.state.bounds[0]} - {this.state.bounds[1]}
					</Badge>
					<Button size="sm" outline className="inlineBtn" onClick={() => this.onPlusClick(btnStep)}>+{btnStep}</Button>
					<RangeEditInPlace
						ref={"editor"}
						title={this.props.title}
						value={{ min: this.state.bounds[0], max: this.state.bounds[1] }}
						min={this.props.min}
						max={this.props.max}
						onChange={(v) => this.onEdit(v)} />
				</div>
				<div style={{ height: "30px" }}>
					{super.render()}
				</div>
			</>
		);
	}
}

export default AdvancedRange;

// inherit props from base class
AdvancedRange.defaultProps = Object.assign({}, Range.defaultProps, {
	editInPlace: false,
	title: '',
	btnStep: 5
});