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
import { confirmModalDialog } from '../../Utils/reactConfirmModalDialog'
import { deleteController } from '../../redux/actions/controllerActions'

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

    state = {
        visible: true,
        mss: ''
    }

    componentDidMount() {
        this.setState({
            mss:this.props.mss
        })
    }

    render() {
        const { classes,controllerList } = this.props;

        return (
            <div>
                {this.state.mss}
                <h5>รายชื่อคอนโทรลเลอร์ที่อยู่ในโรงเรือน</h5>
                <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>Controller Name</CustomTableCell>
                            <CustomTableCell numeric>GreenHouseId</CustomTableCell>
                            <CustomTableCell numeric>IP</CustomTableCell>
                            <CustomTableCell numeric>Mac Address</CustomTableCell>
                            <CustomTableCell numeric>จัดการคอนโทรลเลอร์</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {controllerList && controllerList.map(e => {
                        return (
                            <TableRow className={classes.row} key={e.id}>
                                <CustomTableCell component="th" scope="row">{e.name}</CustomTableCell>
                                <CustomTableCell numeric>{e.greenHouseId}</CustomTableCell>
                                <CustomTableCell numeric>{e.ip}</CustomTableCell>
                                <CustomTableCell numeric>{e.mac_address}</CustomTableCell>
                                <CustomTableCell numeric>
                                    <Button color="secondary" size="sm" >แก้ไข</Button>{"  "}
                                    <Button color="danger" size="sm" onClick={() => this.buttonDelete(e.mac_address)}>ลบ</Button> 
                                </CustomTableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                </Paper>
            </div>
        );
    }

    buttonDelete = (macAddress) => {
        confirmModalDialog({
            show: true,
            title: 'ยืนยันการลบ',
            message: 'คุณต้องการลบคอนโทรลเลอร์นี้ใช่หรือไม่',
            confirmLabel: 'ยืนยัน ลบทันที!!',
            onConfirm: () => {
                this.props.dispatch(deleteController({macAddress: macAddress})).then(() => {
                    this.props.onDelete()
                })
            }
        })
    }
}



GreenHouseControllerList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GreenHouseControllerList);