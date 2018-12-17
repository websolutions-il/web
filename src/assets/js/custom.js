jQuery(document).ready(function($)
{

    // Displaying the departments list
    $('.wing .list_container .column_list li a').on("click", function(event)
    {
        event.preventDefault();
        $(this).parent().addClass('active').siblings().removeClass('active');
        $('.department .list_container .column_overlay').css("display", "none");
        $('.department .list_container').addClass('active');
        if ($(window).width() < 768) {
            $('html, body').animate({
                scrollTop: $(".department").offset().top
            }, 2000);
        }
        else {
            $('.ui.labeled.icon.sidebar').sidebar('toggle');
        }
    });

    $('.department .list_container .column_list li a').on("click", function(event)
    {
        event.preventDefault();
        $(this).parent().addClass('active').siblings().removeClass('active');
        $('.service .list_container .column_overlay').css("display", "none");
        $('.service .list_container').addClass('active');
        if ($(window).width() < 768) {
            $('html, body').animate({
                scrollTop: $(".service").offset().top
            }, 2000);
        }
  });

    $('.service .list_container .column_list li a').on("click", function(event)
    {
        event.preventDefault();
        $(this).parent().addClass('active').siblings().removeClass('active');
        $('.buttons .submit').removeClass('disabled');
    });




    // Calling the mmenu plugin
    // const sidebarContainer = document.querySelector('#my-menu');
    // var API = $('#my-menu').mmenu({
    //     extensions: ['widescreen', 'theme-white', 'effect-menu-slide', 'pagedim-black'],
    //     offCanvas: {
    //         position: "right"
    //     }
    // }).data("mmenu");

    // $('#my-menu').data('mmenu').bind('closed', function () {
    //     $('.navTrigger').removeClass('active');
    // });

    // $('.navTrigger').on('click', function (e) {

    //         e.preventDefault();
    //         if ($('html').hasClass('mm-opened')) {
    //             API.close();
    //             $(this).removeClass('active');
    //             $('.navTrigger').removeClass('active');
    //         } else {
    //             API.open();
    //             $(this).addClass('active');
    //             sidebarContainer.addClass('')
    //         }
    //     }
    // );




    // Displaying the calendar
    $(function () {
        var datesArr = [
            "21/04/2018",
            "27/04/2018",
            "28/04/2018",
            "15/05/2018",
            "16/05/2018",
        ];

        $('#datetimepicker12').datetimepicker({
            inline: true,
            format: 'YYYY-MM-DD',
            locale: 'he',
            minDate: new Date(),
            showTodayButton: false,
            daysOfWeekDisabled: [6, 5]
        });
        $('#datetimepicker12').on("dp.change", function (e) {
            var selected = e.date.format("DD/MM/YYYY");
            var selectedTxt = e.date.format("D MMMM YYYY");
            setCalDates();

            if (datesArr.indexOf(selected) >= 0) {
                $('.hour_overlay').show();
                $('.datepicker').find('*[data-day="' + selected + '"]').addClass('selected');
                $('#selectedDate').html(selectedTxt);

                if ($(window).width() < 768) {
                    $('html, body').animate({
                        scrollTop: $(".hour_container").offset().top
                    }, 2000);
                }
            }
            else {
                e.preventDefault();
                return false;
            }
       });
        $('#datetimepicker12').on("dp.error", function (e) {
            setCalDates();
            console.log("error");
        });
        $('#datetimepicker12').on("dp.show", function (e) {
            setCalDates();
        });
        $('#datetimepicker12').on("dp.update", function (e) {
            setCalDates();
        });
        setCalDates();

        function setCalDates() {
            $('.day.active').removeClass('today').removeClass('active');
            $('.day').addClass('disabled');

            datesArr.forEach(function (element) {
                var tdElem = $('.datepicker').find('*[data-day="' + element + '"]');
                if (!tdElem.hasClass('available'))
                    $('.datepicker').find('*[data-day="' + element + '"]').removeClass('disabled').addClass('available').html('<label>' + tdElem.html()+'</label>');
            });

        }

        $('.hour_list li label').on("click", function (event) {
            event.preventDefault();
            $(this).parent().parent().addClass('active').siblings().removeClass('active');
            $('.buttons .submit').removeClass('disabled');
        });

    });


    // Recaptcha
    var RecaptchaOptions = {
        lang : 'he'
    };






    // Change the select style
    $('select').niceSelect();



    // Add the scrollbar
    const wingList = document.querySelector('.wing .column_list');
    const departList = document.querySelector('.department .column_list');
    const serviceList = document.querySelector('.service .column_list');

    if ($(wingList).length > 0)
    {
        const ps = new PerfectScrollbar(wingList,
        {
            maxScrollbarLength: 130
        });
    }

    if ($(departList).length > 0)
    {
        const ps2 = new PerfectScrollbar(departList,
        {
            maxScrollbarLength: 130
        });
    }

    if ($(serviceList).length > 0)
    {
        const ps3 = new PerfectScrollbar(serviceList,
        {
            maxScrollbarLength: 130
        });
    }






});
