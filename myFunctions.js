/*
============================================================================
                 Project: Premium Car Rental Application
                        File: myFunctions.js
Description: Interactive logic for car selection and booking form validation.
============================================================================
*/

$(document).ready(function () {

    //  NAVBAR 
    // $('#icon-mobile').on('click', function () {
    //     $('#ul-mobile').toggleClass('mobile-nav1');
    // });
    document.getElementById('icon-mobile').onclick = function () {
    $('#ul-mobile').toggleClass('mobile-nav1');
};

    //  TABLE: show / hide details 
    $('.toggle-details').on('change', function () {
        let targetId = '#' + $(this).data('target');
        if ($(this).is(':checked')) {
            $(targetId).css('display', 'table-row').hide().fadeIn(200);
        } else {
            $(targetId).fadeOut(200);
        }
    });

    //  CONTINUE BUTTON 
    $('#continue-btn').on('click', function (e) {
        e.preventDefault();

        let selectedCount = $('input[name="car-select"]:checked').length;

        if (selectedCount === 0) {
            alert('الرجاء تحديد سيارة واحدة على الاقل للمتابعة');
            return;
        }

        $('#booking-section').slideDown(400);
        $('html, body').animate({
            scrollTop: $('#booking-section').offset().top
        }, 500);
    });

    // ================= FORM VALIDATION =================
    $('#car-rental-form').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        //  الاسم: أحرف عربية فقط
        let nameVal = $('#full-name').val().trim();
        let arabicNameRegex = /^[\u0621-\u064A\s]+$/;
        if (nameVal !== "" && !arabicNameRegex.test(nameVal)) {
            $('#name-error').show();
            isValid = false;
        } else {
            $('#name-error').hide();
        }

        //  الرقم الوطني
        let nidVal = $('#national-id').val().trim();
        let nidRegex = /^(0[1-9]|1[0-4])\d{9}$/;
        if (nidVal === "" || !nidRegex.test(nidVal)) {
            $('#nid-error').show();
            isValid = false;
        } else {
            $('#nid-error').hide();
        }

        //التواريخ  
        let startDateVal = $('#start-date').val();
        let endDateVal = $('#end-date').val();
        let startDate, endDate;

        if (!startDateVal || !endDateVal) {
            $('#date-error').text('يرجى إدخال تاريخ البداية وتاريخ النهاية.').show();
            isValid = false;
        } else {
            startDate = new Date(startDateVal);
            endDate = new Date(endDateVal);

                  // فحص مقارنة التواريخ داخل الـ else لضمان توفر القيم
            if (endDate <= startDate) {
                $('#date-error').text('تاريخ النهاية يجب أن يكون لاحقاً لتاريخ البداية.').show();
                isValid = false;
            } else {
                $('#date-error').hide();
            }
        }

        //  الموبايل
        let phoneVal = $('#phone-number').val().trim();
        let phoneRegex = /^(093|098|099|094|095|096)\d{7}$/;
        if (phoneVal !== "" && !phoneRegex.test(phoneVal)) {
            $('#phone-error').show();
            isValid = false;
        } else {
            $('#phone-error').hide();
        }

        //  البريد الإلكتروني
        let emailVal = $('#email').val().trim();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal !== "" && !emailRegex.test(emailVal)) {
            $('#email-error').show();
            isValid = false;
        } else {
            $('#email-error').hide();
        }

        //  RESULT 
        if (isValid) {
            let timeDiff = endDate.getTime() - startDate.getTime();
            let daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24));

            let summaryText = "تم تأكيد الحجز بنجاح\n\nتفاصيل الحجز\n";
            let totalGeneralPrice = 0;

            $('input[name="car-select"]:checked').each(function () {
                let row = $(this).closest('tr');

                let carModel = row.find('td').eq(1).text().trim();
                let priceText = row.find('td').eq(3).text().trim();
                let dailyPrice = parseFloat(priceText.replace('$', '')) || 0;

                let carTotalPrice = dailyPrice * daysCount;
                totalGeneralPrice += carTotalPrice;

                summaryText += `- سيارة: ${carModel} | عدد الأيام: ${daysCount} | إجمالي السعر: $${carTotalPrice}\n`;
            });

            let discountAmount = 0;
            let discountPercent = 0;

            if (daysCount > 7) {
                discountPercent = 10;
                discountAmount = totalGeneralPrice * 0.10;
            }
            let finalTotal = totalGeneralPrice - discountAmount;

            summaryText += `\nالمجموع قبل الخصم: $${totalGeneralPrice.toFixed(2)}`;
            if (discountPercent > 0) {
                summaryText += `\nقيمة الخصم (${discountPercent}% لتجاوز 7 أيام): -$${discountAmount.toFixed(2)}`;
            } else {
                summaryText += `\nقيمة الخصم: $0.00`;
            }
            summaryText += `\nالمبلغ النهائي المستحق: $${finalTotal.toFixed(2)}`;
            alert(summaryText);
        }
    });

});
