import React, { Component } from 'react';
import { getProjectController } from '../../redux/actions/controllerActions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from 'reactstrap';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class GreenHouseControllerList extends Component {

    componentDidMount() {
        this.props.dispatch(getProjectController({
            greenHouseId: this.props.greenHouseId, 
            projectId: this.props.projectId 
        }))
    }

    render() {
        const { classes,pController,buttonDelete,buttonEdit,buttonCreate } = this.props;

        if (pController.isRejected) {
            return <div className="alert alert-danger">Error: {pController.data}</div>
        }
        if (pController.isLoading) {
            return <div>Loading...</div>
        }

        return (
            <div>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>Controller Name</CustomTableCell>
                            <CustomTableCell numeric>Project Id</CustomTableCell>
                            <CustomTableCell numeric>IP</CustomTableCell>
                            <CustomTableCell numeric>Mac Address</CustomTableCell>
                            <CustomTableCell numeric>ปั๊มน้ำ</CustomTableCell>
                            <CustomTableCell numeric>ปั๊มปุ๋ย</CustomTableCell>
                            <CustomTableCell numeric>ปั๊มความชื้น</CustomTableCell>
                            <CustomTableCell numeric>หลอดไฟ</CustomTableCell>
                            <CustomTableCell numeric>
                            <Button color="success" size="sm"
                                    onClick={() => buttonCreate(this.props.greenHouseId,this.props.projectId)}>เพิ่มข้อมูล</Button>
                            </CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pController.data.errorMessage
                        ? <div className="alert alert-danger">{pController.data.errorMessage}</div>
                        :pController.data && pController.data.map(e => {
                        return (
                            <TableRow className={classes.row} key={e.id}>
                                <CustomTableCell component="th" scope="row">{e.name}</CustomTableCell>
                                <CustomTableCell numeric>{e.projectId}</CustomTableCell>
                                <CustomTableCell numeric>{e.ip}</CustomTableCell>
                                <CustomTableCell numeric>{e.mac_address}</CustomTableCell>
                                <CustomTableCell numeric>{e.relayType.water?"มี":"ไม่มี"}</CustomTableCell>
                                <CustomTableCell numeric>{e.relayType.fertilizer?"มี":"ไม่มี"}</CustomTableCell>
                                <CustomTableCell numeric>{e.relayType.moisture?"มี":"ไม่มี"}</CustomTableCell>
                                <CustomTableCell numeric>{e.relayType.light?"มี":"ไม่มี"}</CustomTableCell>
                                <CustomTableCell numeric>
                                    <Button color="secondary" size="sm" onClick={() => buttonEdit(e)}>แก้ไข</Button>{"  "}
                                    <Button color="danger" size="sm" onClick={() => buttonDelete(e.mac_address)}>ลบ</Button> 
                                </CustomTableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        pController: state.controllerReducers.pController,
    }
}

GreenHouseControllerList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(GreenHouseControllerList));