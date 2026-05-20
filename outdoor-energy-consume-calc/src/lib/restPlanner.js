export function planRestStops({ distance, elevation, durationHours, temperature, packWeight }) {
  const isStrenuous = elevation / distance > 100 || packWeight > 20;
  const isHot = temperature > 30;
  const isCold = temperature < 0;
  
  const restInterval = isStrenuous ? 45 : isHot ? 50 : isCold ? 60 : 90;
  
  const restStops = [];
  let totalRestMinutes = 0;
  let currentTime = 0;
  
  while (currentTime < durationHours * 60) {
    currentTime += restInterval;
    if (currentTime >= durationHours * 60) break;
    
    const isLunchStop = currentTime > durationHours * 30 && durationHours > 4;
    const restDuration = isLunchStop ? 30 : isStrenuous ? 10 : isHot ? 15 : 8;
    
    totalRestMinutes += restDuration;
    
    const distanceAtStop = (currentTime / (durationHours * 60)) * distance;
    
    restStops.push({
      index: restStops.length + 1,
      time: formatTime(currentTime),
      distance: distanceAtStop.toFixed(1),
      duration: restDuration,
      type: isLunchStop ? '午餐休息' : '短暂休息',
      tips: getRestTips(isStrenuous, isHot, isCold, isLunchStop)
    });
  }
  
  const totalTime = (durationHours * 60 + totalRestMinutes) / 60;
  
  return {
    restStops,
    totalRestMinutes,
    totalTime: totalTime.toFixed(1),
    restInterval,
    recommendation: getOverallRecommendation(durationHours, elevation, temperature)
  };
}

function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs > 0) {
    return `${hrs}小时${mins}分钟`;
  }
  return `${mins}分钟`;
}

function getRestTips(isStrenuous, isHot, isCold, isLunch) {
  const tips = [];
  
  if (isLunch) {
    tips.push('补充正餐，恢复体力');
    tips.push('拉伸放松肌肉');
  } else {
    tips.push('少量多次补充水分');
    tips.push('快速补充能量');
  }
  
  if (isHot) {
    tips.push('寻找阴凉处休息');
    tips.push('注意防暑降温');
  }
  
  if (isCold) {
    tips.push('保持身体活动');
    tips.push('饮用温水');
  }
  
  if (isStrenuous) {
    tips.push('适当拉伸腿部');
    tips.push('调整呼吸节奏');
  }
  
  return tips;
}

function getOverallRecommendation(duration, elevation, temperature) {
  if (duration > 8) {
    return '长距离徒步建议携带头灯，预留充足休息时间，避免走夜路';
  } else if (elevation > 1500) {
    return '高海拔地区注意高反，上升速度不宜过快，多做深呼吸';
  } else if (temperature > 35) {
    return '高温天气建议调整出发时间，利用清晨和傍晚行进，避免中暑';
  } else if (temperature < -5) {
    return '严寒天气注意保暖，防止冻伤，定期检查手脚温度';
  }
  return '按照计划休息，保持稳定节奏，享受徒步乐趣';
}
