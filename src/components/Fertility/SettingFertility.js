import React, { Component } from 'react';
import { Field, reduxForm ,Form} from 'redux-form';
import { saveFertilityConfig } from '../../redux/actions/planterActions'
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

class SettingFertility extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "projectId": this.props.projectId,
            "minFertility": this.props.minConfig,
            "maxFertility": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { classes,handleSubmit } = this.props

        return (
            <React.Fragment>
            <CssBaseline />
            <main className={classes.layout}>
                <Typography variant="headline">ตั้งค่าอุณหภูมิที่เหมาะสม</Typography>
                <form className={classes.form}>
                  <FormControl margin="normal" required fullWidth>
                    <Field name="minFertility"  component={MaterialRenderTextField} type='number' label="ปริมาณแร่ธาตุต่ำสุด" />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <Field name="maxFertility" component={MaterialRenderTextField} type="number" label="ปริมาณแร่ธาตุสูงสุด" />
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="raised"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmit(this.onSubmit)}
                  >
                    บันทึก
                  </Button>
                </form>
            </main>
          </React.Fragment>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveFertilityConfig(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minFertility)
    let max = parseFloat(values.maxFertility)

    if (values.minFertility === "") {
        errors.minFertility = 'ต้องกรอกปริมาณแร่ธาตุต่ำสุด';
    }else if(min < 0 || min > 100 ){
        errors.minFertility = 'ปริมาณแร่ธาตุต้องอยู่ระหว่าง 0 - 100 ';
    }
    if (values.maxFertility === "") {
        errors.maxFertility = 'ต้องกรอกปริมาณแร่ธาตุสูงสุด';
    }else if(max < 0 || max > 100 ){
        errors.maxFertility = 'ปริมาณแร่ธาตุต้องอยู่ระหว่าง 0 - 100 ';
    }
    if(min > max ){
        errors.minFertility = 'ปริมาณแร่ธาตุต่ำสุดต้องน้อยกว่าสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingFertility',
    validate
})

export default withStyles(styles)(form(SettingFertility));