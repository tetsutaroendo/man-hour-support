$(document).ready(function(){
  var clickTargetIdName,
  clickTargetParthialIdName,
  extractedDate,
  workingTimeData;
  var timeSet = {
    start: '',
    end: '',
    rest: '',
    work: ''
  };
  var unenteredTime = {
    allMinutes: '',
    hours: '',
    minutes: ''
  };

  $('.clEdit').on('click', function(){
    var self = $(this);
    clickTargetParthialIdName = 'idTimesheetEdit-';
    clickTargetIdName = self.find('a[id^=' + clickTargetParthialIdName + ']').attr('id');
    extractedDate = clickTargetIdName.replace(clickTargetParthialIdName, '');
    workingTimeData = self.closest('tr').find('td[class$=' + extractedDate + ']');
    var nullFlag = false;
    Object.keys(timeSet).forEach(function(key){
      var timeIdName = '#id' + key.replace(/^./, function(l){return l.toUpperCase()}) + 'time-' + extractedDate;
      timeSet[key] = workingTimeData.find(timeIdName).html();
      var matchedTime = timeSet[key].match(/(\d+).+(\d+)/);
      if(!matchedTime){
        timeSet[key] = null;
        nullFlag = true;
      }else{
        timeSet[key] = matchedTime[1] * 60 + parseInt(matchedTime[2]);
      }
    });
    if(nullFlag){
      unenteredTime.allMinutes = 0;
    }else{
      unenteredTime.allMinutes = (timeSet.end - timeSet.start - timeSet.rest);
    }
    unenteredTime.hours = parseInt(unenteredTime.allMinutes / 60);
    unenteredTime.minutes = unenteredTime.allMinutes % 60;
    $('.clBoxWorkProject').after(
      '<tr id="idUnenteredtimeTotal">' +
      '<th class="caption fs12px">未入力工数</th>' +
      '<td class="field clUnenteredtimeTotal">' +
      '<span id="idUnenteredtimeTotalH" class="fs150 bold">' +
      unenteredTime.hours +
      '</span> 時間 ' +
      '<span id="idUnenteredtimeTotalM" class="fs150 bold">' +
      unenteredTime.minutes +
      '</span> 分' +
      '</td>' +
      '</tr>'
    );
  });

  var mo = new MutationObserver(function(){
    var changedAllMinuites = unenteredTime.allMinutes - parseInt($('#idJobtimeTotalH').html()) * 60 - parseInt($('#idJobtimeTotalM').html());
    unenteredTime.hours = parseInt(changedAllMinuites / 60);
    unenteredTime.minutes = changedAllMinuites % 60;
    $('#idUnenteredtimeTotalH').html(unenteredTime.hours);
    $('#idUnenteredtimeTotalM').html(unenteredTime.minutes);
    if(unenteredTime.hours === 0 && unenteredTime.minutes === 0){
      $('#idUnenteredtimeTotalH, #idUnenteredtimeTotalM').removeClass('warning');
    }else{
      $('#idUnenteredtimeTotalH, #idUnenteredtimeTotalM').addClass('warning');
    }
  });
  var moTargetH = document.getElementById('idJobtimeTotalH');
  var moTargetM = document.getElementById('idJobtimeTotalM');
  var moConfig = { attributes: true, childList: true, characterData: true };
  mo.observe(moTargetH, moConfig);
  mo.observe(moTargetM, moConfig);

  $(document).on('click', '#button-tmpclose, #button-finish, #button-cancel, .ui-dialog-titlebar-close', function(e){
    $('#idUnenteredtimeTotal').remove();
    return false;
  });

  $(window).on('keyup', function(e){
    if(e.keyCode === 27) {
      $('#idUnenteredtimeTotal').remove();
    }
  });
});
