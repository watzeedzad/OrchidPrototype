import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router'

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

function Menu(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <List component='nav'>
                <ListItem button>
                    <Link to="/weatherControl">
                        <ListItemText primary='สภาพอากาศ' />
                    </Link>
                </ListItem>
                <ListItem button>
                    <Link to="/planterAnalyze">
                        <ListItemText primary='สภาพเครื่องปลูก' />
                    </Link>
                </ListItem>
                <ListItem button>
                    <ListItemText primary='ออกจากระบบ' />
                </ListItem>
            </List>
        </div>
    )
}

Menu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);