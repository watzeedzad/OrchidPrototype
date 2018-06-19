import React, { Component } from 'react'
import TimeKeeper from 'react-timekeeper'
import { Modal, ModalHeader} from 'reactstrap';

class WaterControl extends Component {
    constructor(props){
        super(props)
        this.state = {
            time: '0:00 am',
            time24: '0.00',
            modal: false
        }
        this.handleTimeChange = this.handleTimeChange.bind(this)
    }
    handleTimeChange(newTime){
        this.setState({ time: newTime.formatted}),
        this.setState({ time24: newTime.formatted24})
    }
    toggleTimekeeper(val){
        this.setState({modal: val})
    }
    render(){
        return (
            <div align="center">
                    <Modal isOpen={this.state.modal} toggle={this.toggle} autoFocus={false} size='sm'>
                        <ModalHeader toggle={this.toggle}>ตั้งเวลารดน้ำ</ModalHeader>
                        <div align="center">
                        <br/>
                        <TimeKeeper
                            time={this.state.time}
                            onChange={this.handleTimeChange}
                            config={{
                                TIMEPICKER_BACKGROUND: 'white',
                                DONE_BUTTON_COLOR: '#64c9f1',
                                DONE_BUTTON_BORDER_COLOR: '#ededed'
                            }}
                            onDoneClick={() => {
                                this.toggleTimekeeper(false)
                            }}
                            switchToMinuteOnHourSelect={true}
                        />
                        </div>
                        &nbsp;
                    </Modal>
                
                <br/><br/>
                <span>เวลาที่เลือกคือ {this.state.time} หรือ {this.state.time24} น.</span>
                <br/><br/>
                <button onClick={() => this.toggle()}>OPEN</button>
            </div>
        )
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }
} 

export default WaterControl