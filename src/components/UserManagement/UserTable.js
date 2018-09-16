import React, { Component } from 'react'
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
      width: '80%',
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

//แสดงรายชื่อข้อมูลผู้ใช้ แสดงแบบ HTML TABLE
class UserTable extends Component {
    render() {
        //Destructuring ค่า props ที่ส่งมาจาก  src/pages/User.js  
        const { classes, data, buttonNew, buttonEdit, buttonDelete } = this.props
        
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <CustomTableCell>ประเภทผู้ใช้</CustomTableCell>
                        <CustomTableCell>ชื่อ-สกุล</CustomTableCell>
                        <CustomTableCell>Username</CustomTableCell>
                        <CustomTableCell>
                            <Button color="success" size="sm"
                                onClick={buttonNew}>เพิ่มข้อมูล</Button>
                        </CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* loop ข้อมูลที่ได้รับมา */}
                    {data.errorMessage 
                    ?<div className="alert alert-danger">{data.errorMessage}</div> 
                    :data && data.map(e => {
                        return (
                            <TableRow className={classes.row} key={e.userId}>
                                <CustomTableCell className="text-center">
                                    {e.role}
                                </CustomTableCell>
                                <CustomTableCell>{e.firstname}{' '}{e.lastname}</CustomTableCell>
                                <CustomTableCell>{e.username}</CustomTableCell>
                                <CustomTableCell className="text-center">
                                    <Button color="secondary" size="sm"
                                        onClick={() => buttonEdit(e)}>แก้ไข</Button>{' '}
                                    <Button color="danger" size="sm"
                                        onClick={() => buttonDelete(e._id)}>ลบ</Button>
                                </CustomTableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </Paper>
        )
    }
}

export default withStyles(styles)(UserTable)