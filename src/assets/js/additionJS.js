function playHeaderVideo(){
    document.getElementById("myVideo").play();
}
function flexSlider()
{
    $('.flexslider').flexslider({
        animation: "slide",
        animationLoop: true,
        controlNav: false
      });
}

function setScrollBarForAppointmentsStep2() {
    $("#scrolling_list, #scrolling_list2, #scrolling_list3").mCustomScrollbar({
        autoHideScrollbar: true,
        theme: "rounded"
    });
}
function setScrollBar() {
    $("#content-1").mCustomScrollbar({
        autoHideScrollbar: true,
        theme: "rounded",
        //  setWidth:'30px'
    });
}
function allowOnlyNumbers() {
    $("input[type=tel]").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

}
function arrowDownPreviosCall106() {
    jQuery('.refrence_table tbody').each(function () {
        var $dropdown = jQuery(this);

        jQuery("a.imgText", $dropdown).click(function (e) {
            e.preventDefault();
            var isArrowDown = false;
            if ($(this).hasClass("arrowDown")) {
                isArrowDown = true;
            }

            $("a.imgText").removeClass('arrowDown');

            if (!isArrowDown) {
                $(this).addClass('arrowDown');
            }

            $div = jQuery("tr.showtd", $dropdown);
            $div.fadeToggle("1000", "linear");
            jQuery("tr.showtd").not($div).hide("1000");
            return false;
        });

    });

    jQuery('html').click(function () {
        jQuery("div.showtd").hide("1000");

    });


}
var selectedPrefix = ""; //appointments
function appointmentsUserDetails() {
    // set up select boxes
    $('.selectholder').each(function () {
        $(this).children().hide();
        var description = $(this).children('label').text();
        $(this).append('<span class="desc">' + description + '</span>');
        $(this).append('<span class="pulldown"></span>');
        // set up dropdown element
        $(this).append('<div class="selectdropdown" style="display:none;"></div>');
        $(this).children('select').children('option').each(function () {
            if ($(this).attr('value') != '0') {
                $drop = $(this).parent().siblings('.selectdropdown');
                var name = $(this).attr('value');
                $drop.append('<span>' + name + '</span>');
            }
        });
        // on click, show dropdown
        $(this).click(function () {
            if ($(this).hasClass('activeselectholder')) {
                // roll up roll up
                $(this).children('.selectdropdown').slideUp(200);
                $(this).removeClass('activeselectholder');
                // change span back to selected option text
                if ($(this).children('select').val() != '0') {
                    $(this).children('.desc').fadeOut(100, function () {
                        $(this).text($(this).siblings("select").val());
                        $(this).fadeIn(100);
                    });
                }
            }
            else {
                // if there are any other open dropdowns, close 'em
                $('.activeselectholder').each(function () {
                    $(this).children('.selectdropdown').slideUp(200);
                    // change span back to selected option text
                    if ($(this).children('select').val() != '0') {
                        $(this).children('.desc').fadeOut(100, function () {
                            $(this).text($(this).siblings("select").val());
                            $(this).fadeIn(100);
                        });
                    }
                    $(this).removeClass('activeselectholder');
                });
                // roll down
                $(this).children('.selectdropdown').slideDown(200);
                $(this).addClass('activeselectholder');
                // change span to show select box title while open
                if ($(this).children('select').val() != '0') {
                    $(this).children('.desc').fadeOut(100, function () {
                        $(this).text($(this).siblings("select").children("option[value=0]").text());
                        $(this).fadeIn(100);
                    });
                }
            }
        });
    });
    // select dropdown click action

    $('.selectholder .selectdropdown span').click(function (e) {
        selectedPrefix = e.target.innerHTML;
        console.log(selectedPrefix);
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var value = $(this).text();
        $(this).parent().siblings('select').val(value);
        $(this).parent().siblings('.desc').fadeOut(100, function () {
            $(this).text(value);
            $(this).fadeIn(100);
        });
    });
}

// שתי הפונקציות האלה הם לצורך רקפטצה בדפים בהם ישנם שתי רקפצות(גם של ההרשמה) לכן נדרש להבדיל ביינהם
// כמובן שזה נצרך רק בדפים בהם יש צורך לאפס את הרקפט'צה

var onloadCallback = function () {
    recaptcha2 = grecaptcha.render('recaptcha2', {
        'sitekey': '6LdNthAUAAAAAItribt1-VmPoOC_H5ZYrDxXaf3c',
        'theme': 'light'
    });
};
function resetCaptcha() {
    grecaptcha.reset(recaptcha2);
}

function arrowMyOpend() {
    jQuery('.refrence_table tbody').each(function () {
        var $dropdown = jQuery(this);
        jQuery("a.imgText", $dropdown).click(function (e) {
            e.preventDefault();
            var isArrowDown = false;
            if ($(this).hasClass("arrowDown")) {
                isArrowDown = true;
            }

            $("a.imgText").removeClass('arrowDown');

            if (!isArrowDown) {
                $(this).addClass('arrowDown');
            }

            $div = jQuery("tr.showtd", $dropdown);
            $div.fadeToggle("1000", "linear");
            jQuery("tr.showtd").not($div).hide("1000");
            return false;
        });

    });

    jQuery('html').click(function () {
        jQuery("div.showtd").hide("1000");
    });

}
