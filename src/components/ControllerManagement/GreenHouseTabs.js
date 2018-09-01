import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { getGreenHouseController,deleteController,editController } from '../../redux/actions/controllerActions'
import GreenHouseControllerList from './GreenHouseControllerList';
import { UncontrolledAlert, Modal, ModalHeader } from 'reactstrap';
import { confirmModalDialog } from '../../Utils/reactConfirmModalDialog'
import ControllerForm from './ControllerForm'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

class GreenHouseTabs extends Component {
  state = {
    value: 0,
    mss: '',
    modal: false,
    modalTitle: '',
    controllerData: []
  };

  componentDidMount() {
    this.props.dispatch(getGreenHouseController({ farmId: 123456789 }))
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };
  
  render() {
    const { classes,gController } = this.props;
    const { value } = this.state;
    console.log("controller :"+this.props.gController.data)
    if (gController.isRejected) {
      return <div className="alert alert-danger">Error: {gController.data}</div>
    }
    if (gController.isLoading) {
      return <div>Loading...</div>
    }
    if (gController.data.errorMessage){
      return <div className="alert alert-danger">{gController.data.errorMessage}</div>
    }

    return (
      <div className={classes.root}>
        {this.state.mss}
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            scrollable
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            {gController.data && gController.data.map((e,index) => {
              let label = "โรงเรือนที่ "+(parseInt(index)+1)
              return (
                <Tab label={label} index/>
              )
            })}
          </Tabs>
        </AppBar>
        {gController.data && gController.data.map((e,index) => {
          return (
            value === index && 
            <TabContainer>
              <GreenHouseControllerList controllerList={e}
                greenHouseId={e.greenHouseId}
                buttonCreate={this.handleNew} 
                buttonDelete={this.handleDelete}
                buttonEdit={this.handleEdit}/>
              <br/><br/><hr/>
            </TabContainer>
          )
        })}
        <Modal isOpen={this.state.modal} toggle={this.toggle} 
          className="modal-primary" autoFocus={false}>
            <ModalHeader toggle={this.toggle}>{this.state.modalTitle}คอนโทรลเลอร์</ModalHeader>
            <ControllerForm
              data={this.state.controllerData}
              onSubmit={this.handleSubmit}
              onToggle={this.toggle} />
        </Modal>
      </div>
    );
  }

  toggle = () => {
    this.setState({
        modal: !this.state.modal
    })
  }

  handleNew = (greenHouseId) => {
    this.setState({ modalTitle: 'เพิ่ม' ,controllerData: {farmId:123456789 , greenHouseId: greenHouseId} })
    this.toggle();
  }

  handleEdit = (data) => {
    this.setState({ modalTitle: 'แก้ไข' ,controllerData: data})
    this.toggle()
  }

  handleSubmit = (values) => {
    this.props.dispatch(editController(values)).then(() => {
        this.toggle()
        this.setState({
          mss: 
              <div>
                  <UncontrolledAlert  color="success">
                      ทำการบันทึกข้อมูลคอนโทรลเลอร์สำเร็จ
                  </UncontrolledAlert >
              </div>
        })
        this.props.dispatch(getGreenHouseController({ farmId: 123456789 }))       
    })
  }

  handleDelete = (macAddress) => {
    confirmModalDialog({
        show: true,
        title: 'ยืนยันการลบ',
        message: 'คุณต้องการลบคอนโทรลเลอร์นี้ใช่หรือไม่',
        confirmLabel: 'ยืนยัน ลบทันที!!',
        onConfirm: () => {
            this.props.dispatch(deleteController({macAddress: macAddress})).then(() => {
              this.setState({
                mss: 
                    <div>
                        <UncontrolledAlert  color="success">
                            ทำการลบคอนโทรลเลอร์สำเร็จ
                        </UncontrolledAlert >
                    </div>
              })
              this.props.dispatch(getGreenHouseController({ farmId: 123456789 }))
            })
        }
    })
  }

}

function mapStateToProps(state) {
  return {
      gController: state.controllerReducers.gController,
  }
}

GreenHouseTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(GreenHouseTabs));
