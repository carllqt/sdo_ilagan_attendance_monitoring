<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<style>

body{
    font-family:"Times New Roman", serif;
    font-size:12px;
}

.container{
    width:100%;
    padding:10px 20px;
}
.old-english {
    font-family: 'OldEnglish';
}
.center{
    text-align:center;
}

.header-logo{
    width:65px;
}

.header-text{
    line-height:1.2;
}

.divider{
    border-top:1px solid black;
    margin:6px 0;
}

.title{
    text-align:center;
    font-weight:bold;
    margin:6px 0;
    font-size: 19px;
    text-decoration: underline;
}

table{
    width:100%;
    border-collapse:collapse;
    font-size: 16px;
}

td{
    border:1px solid black;
    padding:6px;
}

.label{
    width:35%;
    font-weight:bold;
}

.small{
    font-size:10px;
}


.signature-box{
    height:80px;
    text-align:center;
    vertical-align:bottom;
}

.certification{
    margin-top:15px;
}

.certification td{
    padding:15px;
}

.footer{
    position:fixed;
    bottom:0;
    left:0;
    width:100%;
    border-top:1px solid black;
    padding:6px 10px;
}

.footer-table{
    width:100%;
}

.footer-logo{
    height:35px;
}

.footer-contact{
    font-size:11px;
    font-weight: bold;
}

.footer-table td{
    border:none;
    padding:0;
}

.icon{
    height:12px;
}

</style>

</head>

<body>

<div class="container">

<!-- HEADER -->
<div class="center header-text">

<img src="<?php echo e(public_path('img/logo.png')); ?>" class="header-logo">

<div class="old-english" style="font-size:16px;">Republic of the Philippines</div>
<div class="old-english" style="font-size:24px;">Department of Education</div>
<div style="font-size:13px; font-weight:bold;">REGION II – CAGAYAN VALLEY</div>
<div style="font-size:13px; font-weight:bold;">SCHOOLS DIVISION OF THE CITY OF ILAGAN</div>

</div>

<div class="divider"></div>

<div class="title">LOCATOR SLIP</div>

<!-- MAIN TABLE -->

<table>

<tr>
<td class="label">NAME</td>
<td><?php echo e(strtoupper($name)); ?></td>
</tr>

<tr>
<td class="label">Position/Designation</td>
<td><?php echo e($position); ?></td>
</tr>

<tr>
<td class="label">Permanent Station</td>
<td><?php echo e($station); ?></td>
</tr>

<tr>
<td class="label">
Purpose of Travel <br>
<span class="small">(must be supported by attachments)</span>
</td>
<td><?php echo e($purpose); ?></td>
</tr>

<tr>
<td class="label">Please Check</td>
<td>

<span style="font-family: DejaVu Sans;">
    <?php echo e($check_type == 'Official Business' ? '☑' : '☐'); ?>

</span>
<span style="font-family: 'Times New Roman', serif;">
    Official Business
</span>

&nbsp;&nbsp;&nbsp;

<span style="font-family: DejaVu Sans;">
    <?php echo e($check_type == 'Official Time' ? '☑' : '☐'); ?>

</span>
<span style="font-family: 'Times New Roman', serif;">
    Official Time
</span>

</td>
</tr>

<tr>
<td class="label">Date and Time</td>
<td><?php echo e($date_time); ?></td>
</tr>

<tr>
<td class="label">Destination</td>
<td><?php echo e($destination); ?></td>
</tr>

<tr>
<td colspan="2" style="padding:0">

<table>

<tr>

<td class="signature-box">
_____________________________<br>
Signature of Requesting Employee
</td>

<td class="signature-box">
_____________________________<br>
Signature of Head of Office
</td>

</tr>

</table>

</td>
</tr>

</table>

<!-- CERTIFICATION -->

<table class="certification">

<tr>
<td class="center"><strong>CERTIFICATION</strong></td>
</tr>

<tr>
<td>

To the concerned:<br><br>

This is to certify that the above-named DepEd official/personnel has visited
or appeared in this Office/place for the purpose and during the date and time stated above.<br><br><br>

<div style="margin-left:50%;">
Name and Signature:<br>
Position/Designation:<br>
Office:
</div>

</td>
</tr>

</table>

</div>

<!-- FOOTER -->

<div class="footer">

<table class="footer-table">

<tr>

<td width="35%">

<img src="<?php echo e(public_path('img/deped_matatag.jpg')); ?>" class="footer-logo">
<img src="<?php echo e(public_path('sdo-pic.jpg')); ?>" class="footer-logo">

</td>

<td align="right" class="footer-contact">

Civic Center, Alibagu, City of Ilagan, Isabela<br>
Telephone Nos. (078) 624-0077<br>

<img src="<?php echo e(public_path('img/fb_logo.png')); ?>" class="icon">
www.facebook.com/sdoilagan

&nbsp;&nbsp;

<img src="<?php echo e(public_path('img/gmail.png')); ?>" class="icon">
ilagan@deped.gov.ph

&nbsp;&nbsp;

<img src="<?php echo e(public_path('img/internet.png')); ?>" class="icon">
www.sdocityofilagan.gov.ph

</td>

</tr>

</table>

</div>

</body>
</html><?php /**PATH C:\Users\arnie\sdo_ilagan_attendance_monitoring\resources\views/pdf/locator-slip.blade.php ENDPATH**/ ?>