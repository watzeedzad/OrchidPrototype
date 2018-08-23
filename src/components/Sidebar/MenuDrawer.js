import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList  from '@material-ui/core/MenuList';
import MenuItem  from '@material-ui/core/MenuItem'; 
import { Link } from 'react-router';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

function MenuDrawer(props) {
    const { classes } = props;
    return (
        // <div className={classes.root}>
        //     {/* <List component='nav'>
        //         <ListItem button>
        //             <Link to="/weatherControl">
        //                 <ListItemText primary='สภาพอากาศ' />
        //             </Link>
        //         </ListItem>
        //         <ListItem button>
        //             <Link to="/planterAnalyze">
        //                 <ListItemText primary='สภาพเครื่องปลูก' />
        //             </Link>
        //         </ListItem>
        //         <ListItem button>
        //             <ListItemText primary='ออกจากระบบ' />
        //         </ListItem>
        //     </List> */}
        // </div>

        <MenuList>
            <Link to="/weatherControl">
               <ListItem button> 
                    สภาพอากาศ  
               </ListItem>
            </Link>
            
            <Link to="/planterAnalyze">
                <ListItem button>
                    สภาพเครื่องปลูก
                </ListItem>
            </Link>

            <Link to="/waterControl">
                <ListItem button>
                    ตั้งค่าการให้น้ำ
                </ListItem>
            </Link>
            <Link to="/fertilizerControl">
                <ListItem button>
                    ตั้งค่าการให้ปุ๋ย
                </ListItem>
            </Link>
            <Link to="/lightControl">
                <ListItem button>
                    จัดการการให้แสง
                </ListItem>
            </Link>
            <Link to="/controllerManagement">
                <ListItem button>
                    จัดการการคอนโทรลเลอร์
                </ListItem>
            </Link>
        </MenuList>
    )
}

MenuDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuDrawer);