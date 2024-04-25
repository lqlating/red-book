<script setup>
// test
import {storeToRefs} from 'pinia'
import {userInfoStore} from "../../store/user";
const userStore = userInfoStore();
const {password,account} = storeToRefs(userStore);
const {submitLogin}  = userStore;
const props = defineProps(["showLogin"]);
const emits = defineEmits(["update:showLogin"]);
const img_src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAABICAMAAABr9CFKAAAAP1BMVEUAAAD/I0L/JEL/JEH/JED/IED/JEH/JUL/JEL/I0H/IED/I0L/JEH/JUD/JEH/I0L/I0D/JEH/I0P/JEP/JEKyzp5HAAAAFHRSTlMA34BgQB+/n++gEJCwMHCfUM9Qz4ilXboAAAQzSURBVGje1ZrrtqMgDIW5S/HSm+//rLNmbFdNNybUg0zP/nd6DOaTkEBUbSr5lZIq1BRWGtROuXkt9UPZeaVQaqXXVt0vJiFGs/9Ckuu+KflCEl1mcyMeuF9MErYi8j5z6tUiP7O6B+MUle/jPOvO1yRBTyyJOk4dsWeljV/7GB+/3iqTnMHkxySoaDLBHMd6JDgllUhQ2uOooSpJTyxSPRJEQQ9dNRJMwZVJ8DEN659MLRKsikeSzANkyq4WCU7JoSSzeyfpK5HglBxMEt5JLpVIsCoeQkIfVRAdlEnkFHw4yURJbCUSrIqHkwyExNSr8R5cO5hEr0jCs5hczEo3nmTs1kr5KZnjZF/6N5hZFCjB2z3T0+RELjOLek1uoZRbLr74/FrtBBLIUMzTxMVvIJUW7+rxVxTmZSTJuzyChyhXhQRj1EslzfAkKe+KZuK5IUmE/MmseEi25FqUbUlCzC4Cic65GeQpaU/iPiEx4no3LUiYRYwkbHqYmE1FKxI08wLJKZOyT0zN+38k6hOSgR4WUb4VCbocGRL0JWRuDKTtSCZwmSGBq9nC6OqSRJYEnzKSyIA28ClYJjF6pUiHeert1xB6S3j6IhJx8+P/CapsKclp3qe73Rij40hwC5n4o8ABJCjtshXCSE55JjfBDuAQEpTZQQI7ArY0HUeCKPgcRRJuJZwhUA8kQT9gcJ4EwZnIa0USE0NikARfhRhuShqSzAYfpEgy5Dt/MJJrShJhlSaWBJM282ayKck8QqnjSLCQDkwKbksyba9sU/L7lWkMtyXp37aEV5EEyfNdCd0tmhqRdG9DBJnklj8EKLe7I4Htw4E6mdGgsa1GrAaZZNxYV+dDOxIoGykJHMxFEv9RF9IeRqIcSzLJJCrfwJiO7kjIb2wijJ0jEZPt/diOBApWOBRGkeSUC8fETEkjkjOkIolkIhaJI+lUQ5JI/pRI8DYXrqHqWpIYWPASSSL/8Ew5uaqWJB6GlkhUyMaP05iCW5IQv6IqIjEbS3q0hkq1JCFWQxmJK/1AsCkJCRYrkGBFGb+KxEGoSCTmZf5VJEpDqAgkI0ziZfwKkgkGFkhUwDfCMfSTpUoPt+xLAz0dwdUfkQxAkiJ4K3y+cSFTQq4FG68Lv3n4lMRnirpZ+eXtojPcB9a8TopzdsIz5n4SPI/1cD55TopmzhmwtO3W5xRYanRNErNpH15r5wYVnHs5dV1cZZztgLICSYpMR+Jh2cEo7PeSrvKUyCTYo8rvZLXPtbCZCtiXTkldEieZu5GNRa1Qt6IpCVVJcEAMGj4WbekHkPhWuDaJy1vLjUL5izvHhe25Bgnmmnz0o1IRcFFVnOuTTEwvCnQqAuGctUBZjQSDX49FARNNUpx6dkqqkmDwyw4OcXmhf+1sUry8DZsZot9LMuq1FFW6/vV/8XDonXroDwd3OfCOVCS+AAAAAElFTkSuQmCC';
const closeDialog = () => {
  emits("update:showLogin", false);
};
function getsubmitLogin(){
  submitLogin();
  closeDialog();
}
</script>


<template>
  <div class="main-body">
    <div>
      <img :src="img_src" alt="">
    </div>
    <div class="input-container">
      <input type="text" placeholder="account" class="input-thing account" v-model="account">
    </div>
    <div class="input-container">
      <input type="password" placeholder="password" class="input-thing" v-model="password">
    </div>
    <button class="login-btn" @click="getsubmitLogin">Login</button>
    <div class="close-btn" @click="closeDialog">&#10005;</div>
  </div>
</template>



<style scoped>

.main-body {
  width: 400px;
  height: 240px;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input-container {
  margin-bottom: 10px;
}

.input-thing {
  font-size: 16px;
  padding-left: 15px;
  width: 220px;
  height: 46px;
  border-radius: 46px;
  outline: none;
  border: none;
  background-color: #f0f0f0;
}

.login-btn {
  outline: none;
  background-color: #ff2e4d;
  font-size: 16px;
  font-weight: bold;
  height: 46px;
  width: 237px; /* Set width same as input */
  border-radius: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
  border: none;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  color: #333;
  cursor: pointer;
}

img {
  margin-left: 0px;
  margin-bottom: 10px;
  width: 110px;
}
</style>
