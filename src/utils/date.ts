import moment from "moment";

const convertDate = (date: any) => {
    let formatedDate = moment(date).utc().format('DD/MM/YYYY');
    return formatedDate;
  }

export {
    convertDate
}
