import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from 'reactstrap';
import { getGreenHouseController } from '../../redux/actions/controllerActions'


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
        this.props.dispatch(getGreenHouseController({ 
            farmId: this.props.farmId, 
            greenHouseId: this.props.greenHouseId 
        }))
    }

    render() {
        const { classes,gController,buttonDelete,buttonEdit,buttonCreate } = this.props;

        if (gController.isRejected) {
            return <div className="alert alert-danger">Error: {gController.data}</div>
        }
        if (gController.isLoading) {
            return <div>Loading...</div>
        }
        
        return (
            <div>
                <h5>รายชื่อคอนโทรลเลอร์ที่อยู่ในโรงเรือน</h5>
                <Button color="primary" size="sm" onClick={() => buttonCreate(this.props.greenHouseId,null)}>เพิ่ม</Button>
                <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>Controller Name</CustomTableCell>
                            <CustomTableCell numeric>GreenHouseId</CustomTableCell>
                            <CustomTableCell numeric>IP</CustomTableCell>
                            <CustomTableCell numeric>Mac Address</CustomTableCell>
                            <CustomTableCell numeric>ปั๊มน้ำ</CustomTableCell>
                            <CustomTableCell numeric>ปั๊มปุ๋ย</CustomTableCell>
                            <CustomTableCell numeric>ปั๊มความชื้น</CustomTableCell>
                            <CustomTableCell numeric>จัดการคอนโทรลเลอร์</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gController.data.errorMessage
                        ? <div className="alert alert-danger">{gController.data.errorMessage}</div>
                        : gController.data && gController.data.map(e => {
                        return (
                            <TableRow className={classes.row} key={e.id}>
                                <CustomTableCell component="th" scope="row">{e.name}</CustomTableCell>
                                <CustomTableCell numeric>{e.greenHouseId}</CustomTableCell>
                                <CustomTableCell numeric>{e.ip}</CustomTableCell>
                                <CustomTableCell numeric>{e.mac_address}</CustomTableCell>
                                <CustomTableCell numeric>{e.pumpType.water?"มี":"ไม่มี"}</CustomTableCell>
                                <CustomTableCell numeric>{e.pumpType.fertilizer?"มี":"ไม่มี"}</CustomTableCell>
                                <CustomTableCell numeric>{e.pumpType.moisture?"มี":"ไม่มี"}</CustomTableCell>
                                <CustomTableCell numeric>
                                    <Button color="secondary" size="sm" onClick={() => buttonEdit(e)}>แก้ไข</Button>{"  "}
                                    <Button color="danger" size="sm" onClick={() => buttonDelete(e.mac_address)}>ลบ</Button> 
                                </CustomTableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
                </Paper>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        gController: state.controllerReducers.gController,
    }
}

GreenHouseControllerList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(GreenHouseControllerList));