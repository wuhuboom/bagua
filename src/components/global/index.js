// 全局组件
import AppBtmBar from "@/components/global/AppBtmBar";
import AppTopBar from "@/components/global/AppTopBar";
import BtmActionSheet from "@/components/global/BtmActionSheet";
import SelectActionSheet from "@/components/global/SelectActionSheet";
import tipsDialog from "@/components/tipsDialog";
import LoadList from "@/components/global/LoadList.vue";
import Countdown from "@choujiaojiao/vue2-countdown";
import {
  ActionSheet,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DropdownItem,
  DropdownMenu,
  Field,
  Form,
  Grid,
  GridItem,
  Icon,
  Image,
  Lazyload,
  List,
  Loading,
  Popup,
  Progress,
  RadioGroup,
  Step,
  Stepper,
  Steps,
  Sticky,
  Swipe,
  SwipeItem,
  Toast,
  circle,
  countDown,
  picker,
  popover,
  radio,
  tab,
  tabs,
  uploader,
  Empty,
  DatetimePicker,
} from "vant";
export default {
  install(Vue) {
    Vue.component("Count-down", Countdown);
    Vue.component(AppBtmBar.name, AppBtmBar);
    Vue.component(AppTopBar.name, AppTopBar);
    Vue.component(tipsDialog.name, tipsDialog);
    Vue.component(BtmActionSheet.name, BtmActionSheet);
    Vue.component(SelectActionSheet.name, SelectActionSheet);
    Vue.component(LoadList.name, LoadList);
    Vue.use(popover);
    Vue.use(tabs);
    Vue.use(tab);
    Vue.use(Form);
    Vue.use(Field);
    Vue.use(Button);
    Vue.use(radio);
    Vue.use(RadioGroup);
    Vue.use(picker);
    Vue.use(ActionSheet);
    Vue.use(Icon);
    Vue.use(Toast);
    Vue.use(Swipe);
    Vue.use(SwipeItem);
    Vue.use(Lazyload);
    Vue.use(Image);
    Vue.use(List);
    Vue.use(Dialog);
    Vue.use(Loading);
    Vue.use(Badge);
    Vue.use(Progress);
    Vue.use(Grid);
    Vue.use(GridItem);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(uploader);
    Vue.use(Checkbox);
    Vue.use(Sticky);
    Vue.use(Popup);
    Vue.use(Step);
    Vue.use(Steps);
    Vue.use(countDown);
    Vue.use(Stepper);
    Vue.use(circle);
    Vue.use(Empty);
    Vue.use(DatetimePicker);
  },
};
