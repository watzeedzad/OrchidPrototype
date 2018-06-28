import React, { Component } from 'react'
import TimeKeeper from 'react-timekeeper'

class ClockPiker extends Component {
    constructor(props){
        super(props)
        this.state = {
            time: '0:00 am',
            time24: '0.00',
            hour24: 0,
            minute: 0
        }
        this.handleTimeChange = this.handleTimeChange.bind(this)
    }
    handleTimeChange(newTime){
        this.setState({ 
            time: newTime.formatted ,
            time24: newTime.formatted24 ,
            hour24: newTime.hour24 ,
            minute: newTime.minute
        })
    }
    toggleTimekeeper(){
        this.props.toggle()
        this.props.addTime(new Date(1970,0,1,this.state.hour24,this.state.minute))
    }
    render(){
        return (
            <div>
                        <TimeKeeper
                            time={this.state.time}
                            onChange={this.handleTimeChange}
                            config={{
                                TIMEPICKER_BACKGROUND: 'white',
                                DONE_BUTTON_COLOR: '#64c9f1',
                                DONE_BUTTON_BORDER_COLOR: '#ededed'
                            }}
                            onDoneClick={() => {
                                this.toggleTimekeeper()
                            }}
                            switchToMinuteOnHourSelect={true}
                        />
                
                <br/><br/>
                <span>เวลาที่เลือกคือ {this.state.time24} น. หรือ {this.state.time} </span>
            </div>
        )
    }
} 

export default ClockPiker