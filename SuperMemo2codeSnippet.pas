begin

DataRecord:=GetDataRecord(ElementNo);
with DataRecord do begin
	if Grade>=3 then begin
		if Repetition=0 then begin
			Interval:=1;
			Repetition:=1;
		end
		else if Repetition=1 then begin
			Interval:=6;
			Repetition:=2;
		end
		else begin
		Interval:=round(Interval*EF);
		Repetition:=Repetition+1;
		end;
	end
	else begin
		Repetition:=0;
		Interval:=1;
	end;
	EF:=EF+(0.1-(5-Grade)*(0.08+(5-Grade)*0.02));
	if EF<1.3 then
		EF:=1.3;
		NextInterval:=Interval;
	end;
	if commit then
		SetDataRecord(ElementNo,DataRecord);
end;
