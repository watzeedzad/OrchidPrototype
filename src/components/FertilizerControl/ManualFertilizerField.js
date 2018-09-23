import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { manaulFertilizer } from '../../redux/actions/fertilizerActions'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import MaterialRenderTextField from '../../Utils/MaterialRenderTextField';

const styles = theme => ({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE11 issue.
      marginTop: theme.spacing.unit * 8,
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
  
    headName:{
      margin: theme.spacing.unit,
    }
  
});

class ManualFertilizerField extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "projectId": this.props.projectId,
            "litre": 0,
        };
        this.props.initialize(initData);
    }

    render() {
        const { classes,handleSubmit } = this.props

        return (
            <React.Fragment>
            <CssBaseline />
            <main className={classes.layout}>
                <Typography variant="headline">กรอกปริมาณน้ำที่ต้องการให้</Typography>
                <form className={classes.form}>
                  <FormControl margin="normal" required fullWidth>
                    <Field name="litre"  component={MaterialRenderTextField} type='number' label="ปริมาณปุ๋ยที่จะให้(ลิตร)" />
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="raised"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmit(this.onSubmit)}
                  >
                    ให้ปุ๋ยทันที
                  </Button>
                </form>
            </main>
          </React.Fragment>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(manaulFertilizer(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let litre = parseFloat(values.litre)

    if (values.litre === "") {
        errors.litre = 'กรุณากรอกปุ๋ยที่ต้องการให้';
    }else if(litre < 0){
        errors.litre = 'ปริมาณปุ๋ยไม่สามารถติดลบได้';
    }else if(litre == 0){
        errors.litre = 'ปริมาณปุ๋ยต้องมากกว่าศูนย์'
    }
    return errors;
}

const form = reduxForm({
    form: 'manaulFertilizer',
    validate
})

export default withStyles(styles)(form(ManualFertilizerField));