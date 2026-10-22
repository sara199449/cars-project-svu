/*
============================================================================
                 Project: Premium Car Rental Application
                        File: myFunctions.js
Description: Interactive logic for car selection and booking form validation.
============================================================================
*/

$(document).ready(function () {

    //  NAVBAR 
    $('#icon-mobile').on('click', function () {
        $('#ul-mobile').toggleClass('mobile-nav1');
    });

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

    // توليد حقول التواريخ تلقائياً داخل الفورم عند اختيار السيارات
    $('input[name="car-select"]').on('change', function () {
        let container = $('#selected-cars-dates-container');
        let list = $('#cars-dates-list');

        list.empty();
        let selectedCars = $('input[name="car-select"]:checked');

        if (selectedCars.length > 0) {
            container.slideDown(200);

            selectedCars.each(function () {
                let row = $(this).closest('tr');
                let carModel = row.find('td').eq(1).text().trim();
                let carCode = row.find('td').eq(0).text().trim();
                let priceText = row.find('td').eq(3).text().trim();
                let dailyPrice = parseFloat(priceText.replace('$', '')) || 0;

                let carDateRow = `
                    <div class="car-date-item" data-car-name="${carCode} - ${carModel}" data-daily-price="${dailyPrice}" style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.1);">
                        <strong style="color: #fff; display: block; margin-bottom: 8px;">🚗 ${carCode} (${carModel})</strong>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <div style="flex:1; min-width: 150px;">
                                <label style="font-size:12px; color:#ddd; display:block; margin-bottom:4px;">تاريخ بداية التأجير:</label>
                                <input type="date" class="car-start-date" required style="width:100%; padding:6px; background:#222; color:#fff; border:1px solid #555; border-radius:4px;" />
                            </div>
                            <div style="flex:1; min-width: 150px;">
                                <label style="font-size:12px; color:#ddd; display:block; margin-bottom:4px;">تاريخ نهاية التأجير:</label>
                                <input type="date" class="car-end-date" required style="width:100%; padding:6px; background:#222; color:#fff; border:1px solid #555; border-radius:4px;" />
                            </div>
                        </div>
                    </div>
                `;
                list.append(carDateRow);
            });
        } else {
            container.slideUp(200);
        }
    });

    // ================= REAL-TIME FORM VALIDATION (التحقق الفوري) =================

    // 1. الاسم الكامل (اختياري تماماً)
    $('#full-name').on('input', function () {
        let nameVal = $(this).val().trim();
        let arabicNameRegex = /^[\u0621-\u064A\s]*$/;
        if (nameVal !== "" && !arabicNameRegex.test(nameVal)) {
            $('#name-error').show();
        } else {
            $('#name-error').hide();
        }
    });

    // 2. الرقم الوطني (إجباري)
    $('#national-id').on('input', function () {
        let nidVal = $(this).val().trim();
        if (nidVal === "") {
            $('#nid-error').hide();
            return;
        }
        let prefix = nidVal.substring(0, 2);
        let validPrefix = /^(0[1-9]|1[0-4])$/;

        if (nidVal.length >= 2 && !validPrefix.test(prefix)) {
            $('#nid-error').show();
        } else if (nidVal.length === 11 && !/^(0[1-9]|1[0-4])\d{9}$/.test(nidVal)) {
            $('#nid-error').show();
        } else {
            $('#nid-error').hide();
        }
    });

    // 3. رقم الموبايل (اختياري)
    $('#phone-number').on('input', function () {
        let phoneVal = $(this).val().trim();
        if (phoneVal === "") {
            $('#phone-error').hide();
            return;
        }
        let prefix = phoneVal.substring(0, 3);
        let validPrefix = /^(093|098|099|094|095|096)$/;

        if (phoneVal.length >= 3 && !validPrefix.test(prefix)) {
            $('#phone-error').show();
        } else if (phoneVal.length === 10 && !/^(093|098|099|094|095|096)\d{7}$/.test(phoneVal)) {
            $('#phone-error').show();
        } else {
            $('#phone-error').hide();
        }
    });

    // 4. البريد الإلكتروني (اختياري)
    $('#email').on('input', function () {
        let emailVal = $(this).val().trim();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal !== "" && !emailRegex.test(emailVal)) {
            $('#email-error').show();
        } else {
            $('#email-error').hide();
        }
    });


    // ================= SUBMIT VALIDATION & CALCULATION =================
    $('#car-rental-form').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // الاسم: اختياري (يُفحص فقط إذا تم إدخال شيء فيه)
        let nameVal = $('#full-name').val().trim();
        let arabicNameRegex = /^[\u0621-\u064A\s]+$/;
        if (nameVal !== "" && !arabicNameRegex.test(nameVal)) {
            $('#name-error').show();
            isValid = false;
        }

        // الرقم الوطني: إجباري وصارم
        let nidVal = $('#national-id').val().trim();
        let nidRegex = /^(0[1-9]|1[0-4])\d{9}$/;
        if (nidVal === "" || !nidRegex.test(nidRegex)) { // تم تصحيح الفحص ليطابق القيمة
            // سيتم التحقق أدناه بدقة
        }
        if (nidVal === "" || !nidRegex.test(nidVal)) {
            $('#nid-error').show();
            isValid = false;
        }

        // الموبايل: اختياري (يُفحص فقط لو وُجدت قيمة)
        let phoneVal = $('#phone-number').val().trim();
        let phoneRegex = /^(093|098|099|094|095|096)\d{7}$/;
        if (phoneVal !== "" && !phoneRegex.test(phoneVal)) {
            $('#phone-error').show();
            isValid = false;
        }

        // الإيميل: اختياري (يُفحص فقط لو وُجدت قيمة)
        let emailVal = $('#email').val().trim();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal !== "" && !emailRegex.test(emailRegex)) {
            // تصحيح الفحص
        }
        if (emailVal !== "" && !emailRegex.test(emailVal)) {
            $('#email-error').show();
            isValid = false;
        }

        if (isValid) {
            let selectedCars = $('input[name="car-select"]:checked');
            if (selectedCars.length === 0) {
                alert('الرجاء تحديد سيارة واحدة على الاقل للمتابعة');
                return;
            }

            let summaryText = "تم تأكيد الحجز بنجاح\n\nتفاصيل الحجز\n";
            let totalGeneralPrice = 0;
            let totalDaysAllCars = 0;
            let datesError = false;

            $('#cars-dates-list .car-date-item').each(function () {
                let carName = $(this).data('car-name');
                let dailyPrice = parseFloat($(this).data('daily-price')) || 0;

                let startVal = $(this).find('.car-start-date').val();
                let endVal = $(this).find('.car-end-date').val();

                // التواريخ إجبارية
                if (!startVal || !endVal) {
                    alert('يرجى إدخال تاريخ بداية التأجير وتاريخ نهاية التأجير للسيارة: ' + carName);
                    datesError = true;
                    return false;
                }

                let startDate = new Date(startVal);
                let endDate = new Date(endVal);

                if (endDate <= startDate) {
                    alert('تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ بداية التأجير للسيارة: ' + carName);
                    datesError = true;
                    return false;
                }

                let timeDiff = endDate.getTime() - startDate.getTime();
                let daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
                totalDaysAllCars += daysCount;

                let carTotalPrice = dailyPrice * daysCount;
                totalGeneralPrice += carTotalPrice;

                summaryText += `- سيارة: ${carName} | عدد الأيام: ${daysCount} | إجمالي السعر: $${carTotalPrice}\n`;
            });

            if (datesError) {
                return;
            }

            let discountAmount = 0;
            let discountPercent = 0;

            if (totalDaysAllCars > 7) {
                discountPercent = 10;
                discountAmount = totalGeneralPrice * 0.10;
            }
            let finalTotal = totalGeneralPrice - discountAmount;

            summaryText += `\nالمجموع قبل الخصم: $${totalGeneralPrice.toFixed(2)}`;
            if (discountPercent > 0) {
                summaryText += `\nقيمة الخصم (${discountPercent}% لتجاوز 7 أيام مجموعاً): -$${discountAmount.toFixed(2)}`;
            } else {
                summaryText += `\nقيمة الخصم: $0.00`;
            }
            summaryText += `\nالمبلغ النهائي المستحق: $${finalTotal.toFixed(2)}`;

            alert(summaryText);
        }
    });

});
