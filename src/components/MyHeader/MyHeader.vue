<script setup>

</script>
<template>
  <div>
    <div class="search-box">
      <span><img height="30px"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAABICAMAAABr9CFKAAAAP1BMVEUAAAD/I0L/JEL/JEH/JED/IED/JEH/JUL/JEL/I0H/IED/I0L/JEH/JUD/JEH/I0L/I0D/JEH/I0P/JEP/JEKyzp5HAAAAFHRSTlMA34BgQB+/n++gEJCwMHCfUM9Qz4ilXboAAAQzSURBVGje1ZrrtqMgDIW5S/HSm+//rLNmbFdNNybUg0zP/nd6DOaTkEBUbSr5lZIq1BRWGtROuXkt9UPZeaVQaqXXVt0vJiFGs/9Ckuu+KflCEl1mcyMeuF9MErYi8j5z6tUiP7O6B+MUle/jPOvO1yRBTyyJOk4dsWeljV/7GB+/3iqTnMHkxySoaDLBHMd6JDgllUhQ2uOooSpJTyxSPRJEQQ9dNRJMwZVJ8DEN659MLRKsikeSzANkyq4WCU7JoSSzeyfpK5HglBxMEt5JLpVIsCoeQkIfVRAdlEnkFHw4yURJbCUSrIqHkwyExNSr8R5cO5hEr0jCs5hczEo3nmTs1kr5KZnjZF/6N5hZFCjB2z3T0+RELjOLek1uoZRbLr74/FrtBBLIUMzTxMVvIJUW7+rxVxTmZSTJuzyChyhXhQRj1EslzfAkKe+KZuK5IUmE/MmseEi25FqUbUlCzC4Cic65GeQpaU/iPiEx4no3LUiYRYwkbHqYmE1FKxI08wLJKZOyT0zN+38k6hOSgR4WUb4VCbocGRL0JWRuDKTtSCZwmSGBq9nC6OqSRJYEnzKSyIA28ClYJjF6pUiHeert1xB6S3j6IhJx8+P/CapsKclp3qe73Rij40hwC5n4o8ABJCjtshXCSE55JjfBDuAQEpTZQQI7ArY0HUeCKPgcRRJuJZwhUA8kQT9gcJ4EwZnIa0USE0NikARfhRhuShqSzAYfpEgy5Dt/MJJrShJhlSaWBJM282ayKck8QqnjSLCQDkwKbksyba9sU/L7lWkMtyXp37aEV5EEyfNdCd0tmhqRdG9DBJnklj8EKLe7I4Htw4E6mdGgsa1GrAaZZNxYV+dDOxIoGykJHMxFEv9RF9IeRqIcSzLJJCrfwJiO7kjIb2wijJ0jEZPt/diOBApWOBRGkeSUC8fETEkjkjOkIolkIhaJI+lUQ5JI/pRI8DYXrqHqWpIYWPASSSL/8Ew5uaqWJB6GlkhUyMaP05iCW5IQv6IqIjEbS3q0hkq1JCFWQxmJK/1AsCkJCRYrkGBFGb+KxEGoSCTmZf5VJEpDqAgkI0ziZfwKkgkGFkhUwDfCMfSTpUoPt+xLAz0dwdUfkQxAkiJ4K3y+cSFTQq4FG68Lv3n4lMRnirpZ+eXtojPcB9a8TopzdsIz5n4SPI/1cD55TopmzhmwtO3W5xRYanRNErNpH15r5wYVnHs5dV1cZZztgLICSYpMR+Jh2cEo7PeSrvKUyCTYo8rvZLXPtbCZCtiXTkldEieZu5GNRa1Qt6IpCVVJcEAMGj4WbekHkPhWuDaJy1vLjUL5izvHhe25Bgnmmnz0o1IRcFFVnOuTTEwvCnQqAuGctUBZjQSDX49FARNNUpx6dkqqkmDwyw4OcXmhf+1sUry8DZsZot9LMuq1FFW6/vV/8XDonXroDwd3OfCOVCS+AAAAAElFTkSuQmCC"
          alt=""></span>

      <span class="input-wrapper">
        <input type="text" class="input-box" placeholder="Search...">
        <div class="search-icon"></div>
      </span>

      <span class="work-together">
        <span class="creation" style="margin-right:20px">
          创作中心
        </span>
        <div class="drop-down">
          <div class="creation-inner">创作服务</div>
          <div class="creation-inner">直播管理</div>
          <div class="creation-inner">电脑直播助手</div>
        </div>
        <div class="useless"></div>
        <span class="together">业务合作</span>
        <div class="useless2"></div>
        <div class="drop-down2">
          <div class="creation-inner">推广号</div>
          <div class="creation-inner">推广合作</div>
          <div class="creation-inner">蒲公英</div>
          <div class="creation-inner">商家入驻</div>
          <div class="creation-inner">MCN入驻</div>
        </div>
      </span>

    </div>
  </div>
</template>
<style scoped>
.useless{
  position: absolute;
  width: 88.74px;
  top:30px;
  height: 10px;
  left: 0px;
}
.useless2{
  position: absolute;
  width: 84px;
  top:30px;
  height: 10px;
  left: 110px;
  
}
.search-box {
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
}

.input-wrapper {
  position: relative;
  margin-left: 30px;


}

.search-icon {
  position: absolute;
  right: 1;
  top: 0;

}

.work-together {
  position: relative;
  color: #888;
}

.together {
  padding: 10px;
}

.together:hover {
  background-color: #f0f0f0;
  /* 鼠标悬停时的背景颜色 */
  border-radius: 20px;
  /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 阴影 */
}

.creation {
  padding: 10px;
  margin-bottom: 0px;

}
.drop-down:has(~ .useless:hover) { 
    display: block;
}
.creation-inner{
  display: flex;
    
    align-items: center; /* 垂直居中 */
    height: 40px; /* 调整元素高度，以适应内容 */
    cursor: pointer; /* 鼠标悬停时显示指针样式 */
    
    border-radius: 10px;
    padding-left: 10px;
}
.creation-inner:hover{
  background-color: #f0f0f0;
}
.drop-down {
  display: none;
  width: 150px;
  height: auto;
  background-color: white;
  border-radius: 17px;
  position: absolute;
  top: 40px;
  left: -40px;
  padding: 5px;
  border: 1px solid #f0f0f0;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
.drop-down2 {
  display: none;
  width: 150px;
  height: auto;
  background-color: white;
  border-radius: 17px;
  position: absolute;
  top: 40px;
  left: 80px;
  padding: 5px;
  border: 1px solid #f0f0f0;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.creation:hover + .drop-down,

.drop-down:hover {
  display: block;
}
.together:hover ~ .drop-down2,
.useless2:hover + .drop-down2,
.drop-down2:hover
{
  display: block;
}
.useless:hover + .drop-down{
  display: block;
}
.creation:hover {
  background-color: #f0f0f0;
  /* 鼠标悬停时的背景颜色 */
  border-radius: 20px;
  /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 阴影 */
}

.input-container {
  position: relative;
  width: 300px;
  margin: 50px auto;
}

.input-box {
  background-color: #f5f5f5;

  border: 1px solid black;
  width: 500px;
  padding: 12px 40px 12px 16px;
  /* 调整输入框内边距以给图标留出空间 */
  border: none;
  border-radius: 20px;
  /* 设置圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 添加阴影 */
  font-size: 16px;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

/* 图标样式仅作示例，实际项目中可替换为合适的图标 */
.search-icon::before {
  content: '\1F50D';
  /* 放大镜图标 */
  font-size: 20px;
}</style>