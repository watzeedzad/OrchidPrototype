import React, { Component } from 'react';
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

    render() {
        const { classes,controllerList,buttonDelete,buttonEdit,buttonCreate } = this.props;
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
                        {controllerList.errorMessage
                        ? <div className="alert alert-danger">{controllerList.errorMessage}</div>
                        : controllerList && controllerList.map(e => {
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



GreenHouseControllerList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GreenHouseControllerList);