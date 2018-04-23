import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import MenuIcon from '@material-ui/icons/Menu';


const drawerWidth = 240;

const styles = theme =>({
    
    root:{
        flexGrow:1,
        height: 430,
        zIndex: 1,
        overFlow: 'hidden',
        position: 'relative',
        display: 'flax',
        width:'100%',
    },
    appBar: {
        position: 'absolute',
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
          width: `calc(100% - ${drawerWidth}px)`,
        },
      },
    navIconHide:{
        [theme.breakpoints.up('md')]:{
            display:'none',
        },
    },

    toolbar: theme.mixins.toolbar,
    drawerPaper:{
        width: drawerWidth,
        [theme.breakpoints.up('md')]:{
            position: 'relative',
        },
    },

    content:{
        flexGrow:1,
        backgroundColor :theme.palette.background.default,
        padding: theme.spacing.unit * 3
    }

})


class DrawerUi extends Component{

    state = {
        mobileOpen:false,
    };

    handleDrawerToggle=()=>{
        this.setState({ mobileOpen: !this.state.mobileOpen });
    }


    render(){
        
      const { classes, theme } = this.props;
            return(       
                <div className={classes.root}>
                     <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                                className={classes.navIconHide}
                            >
                            <MenuIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit"  noWrap>
                          
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
                        <Drawer>
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper:classes.drawPaper,
                            }}
                            ModalProps={{
                                keepMouted : true
                            }}                         

                        </Drawer>            
                    </Hidden>
                </div>
            )
            }
        }

            Drawer.propTypes = {
            classes: PropTypes.object.isRequired,
            theme: PropTypes.object.isRequired,
        };

  export default withStyles(styles,{ withTheme: true})(DrawerUi);