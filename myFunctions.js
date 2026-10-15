/*
============================================================================
                 Project: Premium Car Rental Application
                        File: myfunctions.js
Description: Interactive logic for car selectin and booking form validation.
============================================================================

 */

// NAVBAR
let icon = document.getElementById("icon-mobile");
let ul = document.getElementById("ul-mobile");


icon.onclick = function () {
    ul.classList.toggle("mobile-nav1");
}


 document.addEventListener("DOMContentLoaded", function() {
     let icon = document.getElementById("icon-mobile");
     let ul = document.getElementById("ul-mobile");

     icon.onclick = function() {
         ul.classList.toggle("mobile-nav1");
     }
 });






// TABLE 

$(document).ready(function () {

    $('.toggle-details').on('change', function () {
        let targetId = '#' + $(this).data('target');
        if ($(this).is(':checked')) {
            $(targetId).css('display', 'table-row').hide().fadeIn(200);
        } else {
            $(targetId).fadeOut(200);
        }
    });

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

    $('#car-rental-form').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        let nameVal = $('#full-name').val().trim();
        let arabicNameRegex = /^[\u0600-\u06FF\s]+$/;
        if (nameVal !== "" && !arabicNameRegex.test(nameVal)) {
            $('#name-error').show();
            isValid = false;
        } else {
            $('#name-error').hide();
        }

        let nidVal = $('#national-id').val().trim();
        let nidRegex = /^(0[1-9]|1[0-4])\d{9}$/;
        if (nidVal === "" || !nidRegex.test(nidVal)) {
            $('#nid-error').show();
            isValid = false;
        } else {
            $('#nid-error').hide();
        }

        let startDateVal = $('#start-date').val();
        let endDateVal = $('#end-date').val();
        let startDate, endDate; // تعريف المتغيرات في النطاق الخارجي لتكون مرئية للجميع

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

                summaryText += `- سيارة: ${carModel} | ايام: ${daysCount} ايام | اجمالي السعر: ${carTotalPrice}$\n`;
            });

            let discountAmount = 0;
            let discountPercent = 0;

            if (daysCount > 7) {
                discountPercent = 10;
                discountAmount = totalGeneralPrice * 0.10;
            }
            let finalTotal = totalGeneralPrice - discountAmount;

            summaryText += `\n المجموع قبل الخصم: $${totalGeneralPrice.toFixed(2)}`;
            if (discountPercent > 0) {
                summaryText += `\n قيمة الخصم (${discountPercent}% لتجاوز 7 أيام): -$${discountAmount.toFixed(2)}`;
            } else {
                summaryText += `\n0.00$ :قيمة الخصم`;
            }
            summaryText += `\nالمبلغ النهائي المستحق: $${finalTotal.toFixed(2)}`;
            alert(summaryText);
        }
    });

});





